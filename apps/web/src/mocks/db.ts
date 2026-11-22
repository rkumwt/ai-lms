import type {
  Category,
  Course,
  ProcessingStage,
  QuizAttempt,
  Settings,
  Topic,
  TopicAi,
  Video,
} from '@/types';

import { makeCover } from './covers';
import { generateTopicAi, type TopicContent } from './generate';
import { CATEGORY_NAMES, COURSE_SEEDS, type TopicSeed } from './seed';
import { createId, dateOnly, daysFromNow, escapeHtml } from './utils';

export const MOCK_VIDEO_URL = '/mock/lecture.mp4';

/** Server-side record of an AI processing job (the client sees a derived ProcessingJob). */
export interface JobRecord {
  id: string;
  topicId: string;
  startedAtMs: number;
  attempt: number;
  /** Stage at which this attempt is scripted to fail, or null. */
  failAt: ProcessingStage | null;
}

export interface Db {
  categories: Category[];
  courses: Course[];
  topics: Topic[];
  videos: Video[];
  ai: Map<string, TopicAi>;
  content: Map<string, TopicContent>;
  jobs: Map<string, JobRecord>;
  quizAttempts: QuizAttempt[];
  /** Dates (yyyy-MM-dd) with study activity, used for the streak. */
  studyDays: Set<string>;
  settings: Settings;
}

/** Topics whose first processing attempt fails at "flashcards" so the Retry flow can be seen. */
export const FAIL_FIRST_ATTEMPT = new Set(['c-aws-t4']);

const DEFAULT_SETTINGS: Settings = {
  profile: {
    name: 'Alex Learner',
    email: 'alex@example.com',
    bio: 'Learning in public, one topic at a time.',
  },
  recording: { source: 'screen_camera', countdown: true, teleprompter: true, quality: '1080p' },
  ai: { summaryLength: 'medium', quizDifficulty: 'medium', flashcardCount: 5 },
  theme: 'system',
};

function notesFromPoints(points: string[]): string {
  const items = points.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  return `<p>Key ideas I want to explain:</p><ul>${items}</ul>`;
}

function seedAttempts(topic: Topic, courseId: string): QuizAttempt[] {
  if (topic.status !== 'ready') return [];
  const score = topic.confidence === 'strong' ? 3 : topic.confidence === 'weak' ? 1 : 2;
  return [8, 3].map((daysAgo, i) => ({
    id: createId('qa'),
    courseId,
    topicId: topic.id,
    topicTitle: topic.title,
    score: Math.min(3, score + i),
    total: 3,
    takenAt: daysFromNow(-daysAgo, 18),
  }));
}

function buildTopic(courseId: string, seed: TopicSeed, index: number): Topic {
  const id = `${courseId}-t${index + 1}`;
  const recordedAt = seed.recordedDaysAgo !== undefined ? daysFromNow(-seed.recordedDaysAgo) : null;
  const hasVideo = seed.status !== 'draft' && seed.status !== 'processing';
  return {
    id,
    courseId,
    order: index + 1,
    title: seed.title,
    tags: seed.tags,
    notesHtml: notesFromPoints(seed.points),
    links: (seed.links ?? []).map((l) => ({ id: createId('ln'), ...l })),
    status: seed.status,
    durationSec: seed.durationSec ?? 0,
    confidence: seed.confidence ?? null,
    nextReviewAt: seed.reviewInDays !== undefined ? daysFromNow(seed.reviewInDays, 8) : null,
    lastReviewedAt: seed.confidence && recordedAt ? daysFromNow(-2) : null,
    videoId: hasVideo ? `v-${id}` : null,
    createdAt: daysFromNow(-(seed.recordedDaysAgo ?? 0) - 2),
    updatedAt: recordedAt ?? daysFromNow(-1),
  };
}

function createDb(): Db {
  const categories = CATEGORY_NAMES.map((name) => ({ id: `cat-${name.toLowerCase()}`, name }));
  const db: Db = {
    categories,
    courses: [],
    topics: [],
    videos: [],
    ai: new Map(),
    content: new Map(),
    jobs: new Map(),
    quizAttempts: [],
    studyDays: new Set(),
    settings: structuredClone(DEFAULT_SETTINGS),
  };

  for (const seed of COURSE_SEEDS) {
    db.courses.push({
      id: seed.id,
      title: seed.title,
      description: seed.description,
      categoryId: `cat-${seed.category.toLowerCase()}`,
      tags: seed.tags,
      coverUrl: makeCover(seed.title, seed.cover),
      level: seed.level,
      targetDate: seed.targetInDays === null ? null : dateOnly(daysFromNow(seed.targetInDays)),
      archived: false,
      createdAt: daysFromNow(-seed.createdDaysAgo),
      updatedAt: daysFromNow(-seed.updatedDaysAgo, 10),
    });

    const answers = seed.topics.flatMap((t) => t.qa.map(([, a]) => a));
    seed.topics.forEach((topicSeed, index) => {
      const topic = buildTopic(seed.id, topicSeed, index);
      const content: TopicContent = { points: topicSeed.points, qa: topicSeed.qa };
      db.topics.push(topic);
      db.content.set(topic.id, content);

      if (topic.videoId) {
        db.videos.push({
          id: topic.videoId,
          topicId: topic.id,
          url: MOCK_VIDEO_URL,
          durationSec: topic.durationSec,
          createdAt: topic.updatedAt,
        });
      }
      if (topic.status === 'ready') {
        db.ai.set(
          topic.id,
          generateTopicAi(topic.id, topic.title, content, topic.durationSec, answers),
        );
      }
      if (topic.status === 'processing') {
        db.jobs.set(topic.id, {
          id: createId('job'),
          topicId: topic.id,
          startedAtMs: Date.now(),
          attempt: 1,
          failAt: null,
        });
      }
      if (topic.status === 'failed') {
        db.jobs.set(topic.id, {
          id: createId('job'),
          topicId: topic.id,
          startedAtMs: Date.now() - 3_600_000,
          attempt: 1,
          failAt: 'flashcards',
        });
      }
      db.quizAttempts.push(...seedAttempts(topic, seed.id));
    });
  }

  for (const daysAgo of [1, 2, 3, 4, 5, 6, 9, 10, 13, 16]) {
    db.studyDays.add(dateOnly(daysFromNow(-daysAgo)));
  }
  return db;
}

/** The in-memory "database". Lives for the browser session; reload resets it. */
export const db: Db = createDb();
