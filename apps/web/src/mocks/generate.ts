import type { Flashcard, QuizQuestion, TopicAi, TranscriptLine } from '@/types';

import { createId, seededRandom, shuffle } from './utils';

export interface TopicContent {
  points: string[];
  qa: [string, string][];
}

const FILLERS = [
  'Let me show this with a quick example on screen.',
  'This is the part that usually trips people up in interviews.',
  'Keep this in mind, because we will build on it next.',
  'If you remember one thing from this section, make it this.',
];

/** Builds a plausible transcript, summary, flashcards and quiz from a topic's key facts. */
export function generateTopicAi(
  topicId: string,
  title: string,
  content: TopicContent,
  durationSec: number,
  distractors: string[],
  variant = 0,
): TopicAi {
  const rand = seededRandom(`${topicId}:${variant}`);
  const sentences: string[] = [`Hi, in this recording I am explaining ${title}.`];
  content.points.forEach((point, i) => {
    sentences.push(point, FILLERS[(i + variant) % FILLERS.length] ?? '');
  });
  content.qa.forEach(([q, a]) => sentences.push(`A common question is: ${q} The answer is: ${a}.`));
  sentences.push(`That is the core of ${title}. Review the flashcards and try the quiz next.`);

  const total = Math.max(durationSec, sentences.length * 8);
  const step = total / sentences.length;
  const transcript: TranscriptLine[] = sentences.map((text, i) => ({
    id: createId('tl'),
    startSec: Math.round(i * step),
    endSec: Math.round((i + 1) * step),
    text,
  }));

  const summary =
    `${title} comes down to ${content.points.length} ideas. ` +
    content.points.map((p) => p.replace(/\.$/, '')).join('. ') +
    '. Revisit the quiz questions to check that the details stuck.';

  const flashcards: Flashcard[] = content.qa.map(([front, back]) => ({
    id: createId('fc'),
    front,
    back,
  }));

  const quiz: QuizQuestion[] = content.qa.map(([question, answer], i) => {
    const pool = shuffle(
      distractors.filter((d) => d !== answer),
      rand,
    ).slice(0, 3);
    const options = shuffle([answer, ...pool], rand);
    return {
      id: createId('qq'),
      question,
      options,
      correctIndex: options.indexOf(answer),
      explanation: content.points[i] ?? content.points[0] ?? answer,
    };
  });

  return {
    topicId,
    transcript,
    summary,
    keyPoints: [...content.points],
    flashcards,
    quiz,
    updatedAt: new Date().toISOString(),
  };
}

/** Fallback content for topics created in the UI (no seed facts). */
export function contentFromTitle(title: string): TopicContent {
  return {
    points: [
      `${title} solves a specific problem; start by stating that problem clearly.`,
      `Explain how ${title} works step by step with one concrete example.`,
      `Know the trade-offs and when not to use ${title}.`,
    ],
    qa: [
      [`What problem does ${title} solve?`, 'The problem stated at the start of the recording'],
      [`What is a key trade-off of ${title}?`, 'Extra complexity in exchange for flexibility'],
      [`When should you avoid ${title}?`, 'When a simpler approach meets the requirements'],
    ],
  };
}
