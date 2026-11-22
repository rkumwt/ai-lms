import { db } from '@/mocks/db';
import { withCourse } from '@/mocks/derive';
import { contentFromTitle, generateTopicAi } from '@/mocks/generate';
import { COURSE_SEEDS } from '@/mocks/seed';
import { createId, stripHtml } from '@/mocks/utils';
import type { AiSection, AskAiAnswer, AskAiSource, OutlineSuggestionInput, TopicAi } from '@/types';

import { mockRequest, notFound } from './client';

type EditableAi = Partial<
  Pick<TopicAi, 'transcript' | 'summary' | 'keyPoints' | 'flashcards' | 'quiz'>
>;

const variants = new Map<string, number>();

function findAi(topicId: string): TopicAi {
  return db.ai.get(topicId) ?? notFound('AI results');
}

export const getTopicAi = (topicId: string) => mockRequest(() => db.ai.get(topicId) ?? null);

export const updateTopicAi = (topicId: string, patch: EditableAi) =>
  mockRequest(() => {
    const ai = findAi(topicId);
    Object.assign(ai, patch, { updatedAt: new Date().toISOString() });
    return ai;
  });

export const regenerateSection = (topicId: string, section: AiSection) =>
  mockRequest(() => {
    const ai = findAi(topicId);
    const topic = db.topics.find((t) => t.id === topicId) ?? notFound('Topic');
    const variant = (variants.get(topicId) ?? 0) + 1;
    variants.set(topicId, variant);
    const content = db.content.get(topicId) ?? contentFromTitle(topic.title);
    const answers = db.topics.flatMap((t) => db.content.get(t.id)?.qa.map(([, a]) => a) ?? []);
    const fresh = generateTopicAi(
      topicId,
      topic.title,
      content,
      topic.durationSec,
      answers,
      variant,
    );
    if (section === 'summary') {
      ai.summary = `${fresh.summary} (Regenerated, version ${variant + 1}.)`;
      ai.keyPoints = [...fresh.keyPoints].reverse();
    } else {
      ai[section] = fresh[section] as never;
    }
    ai.updatedAt = new Date().toISOString();
    return ai;
  });

/** Strips filler words so "Kafka for Backend Engineers" becomes "Kafka". */
function subjectOf(title: string): string {
  const cleaned = title
    .replace(/\b(for|in|with)\b.*$/i, '')
    .replace(
      /\b(deep dive|fundamentals|refresh|interview prep|basics|course|masterclass|patterns|and performance)\b/gi,
      '',
    )
    .trim();
  return cleaned || title.trim() || 'this subject';
}

export const suggestOutline = ({ title, description }: OutlineSuggestionInput) =>
  mockRequest(() => {
    const subject = subjectOf(title).toLowerCase();
    // Reuse a seeded outline only when the subject clearly names that course (e.g. "AWS", "Node.js").
    const seed = COURSE_SEEDS.find((c) => {
      const head = c.title.split(/\s+/)[0]?.toLowerCase() ?? '';
      return head.length > 2 && subject.includes(head);
    });
    if (seed) return seed.topics.map((t) => t.title);
    const s = subjectOf(title);
    const extra = description.toLowerCase().includes('interview')
      ? [`${s} interview questions`]
      : [];
    return [
      `What is ${s} and why it matters`,
      `Core concepts and vocabulary of ${s}`,
      `How ${s} works under the hood`,
      `Hands-on: a first ${s} example`,
      `Common mistakes with ${s} and how to avoid them`,
      `${s} in production: monitoring and scaling`,
      ...extra,
    ];
  });

export const suggestKeyPoints = (title: string, notesHtml: string) =>
  mockRequest(() => {
    const lines = stripHtml(notesHtml)
      .split(/\n|(?<=\.)\s+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 25);
    if (lines.length >= 2) return lines.slice(0, 5);
    return contentFromTitle(title || 'this topic').points;
  });

export const suggestInterviewQuestions = (title: string) =>
  mockRequest(() => {
    const subject = title.trim() || 'this topic';
    return [
      `Explain ${subject} to a junior developer in two minutes.`,
      `What problem does ${subject} solve, and what are the alternatives?`,
      `Describe a bug or incident you could hit with ${subject}.`,
      `How would you test code that relies on ${subject}?`,
      `What trade-offs would make you avoid ${subject}?`,
    ];
  });

const SUGGESTED_QUESTIONS = [
  'What runs first: nextTick or promises?',
  'How do I pick a good shard key?',
  'Explain backpressure in streams',
  'When does an IAM Deny win?',
  'What does "this" refer to in an arrow function?',
];

export const getSuggestedQuestions = () => mockRequest(() => SUGGESTED_QUESTIONS);

const STOPWORDS = new Set(
  'the and for are but not you your with what when where which who how why does did this that from into than then them they their there runs first explain about can should would could will have has had was were been being its it'.split(
    ' ',
  ),
);

function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])
    .filter((w) => !STOPWORDS.has(w))
    .map((w) => (w.length > 4 ? w.replace(/s$/, '') : w));
}

/** Very small keyword search over transcripts to fake retrieval-augmented answers. */
export const askAi = (question: string) =>
  mockRequest<AskAiAnswer>(() => {
    const queryWords = new Set(words(question));
    const scored: { source: AskAiSource; score: number; point: string }[] = [];
    for (const [topicId, ai] of db.ai) {
      const topic = db.topics.find((t) => t.id === topicId);
      if (!topic) continue;
      const full = withCourse(topic);
      for (const line of ai.transcript) {
        const score = words(`${line.text} ${topic.title}`).filter((w) => queryWords.has(w)).length;
        if (score >= 2) {
          scored.push({
            score,
            point: ai.keyPoints[0] ?? line.text,
            source: {
              courseId: topic.courseId,
              courseTitle: full.courseTitle,
              topicId,
              topicTitle: topic.title,
              timestampSec: line.startSec,
              snippet: line.text,
            },
          });
        }
      }
    }
    scored.sort((a, b) => b.score - a.score);
    const unique = scored
      .filter((s, i) => scored.findIndex((o) => o.source.topicId === s.source.topicId) === i)
      .slice(0, 3);

    const answer = unique.length
      ? `Based on your recordings: ${unique[0]?.source.snippet ?? ''}\n\n` +
        unique.map((s) => `• ${s.point}`).join('\n') +
        '\n\nJump to the sources below to rewatch the exact moment.'
      : "I couldn't find this in your recordings yet. Try rephrasing, or record a topic that covers it and I'll be able to answer from your own explanation.";
    return { id: createId('ans'), question, answer, sources: unique.map((s) => s.source) };
  });
