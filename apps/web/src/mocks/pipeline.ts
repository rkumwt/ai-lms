import { PROCESSING_STAGES, type ProcessingJob, type Topic } from '@/types';

import { db, FAIL_FIRST_ATTEMPT, type JobRecord } from './db';
import { contentFromTitle, generateTopicAi } from './generate';
import { createId } from './utils';

/** Each pipeline stage takes ~2 s, so a full run is ~10 s. */
const STAGE_MS = 2000;
const WORK_STAGES = PROCESSING_STAGES.length - 1;

function courseAnswers(courseId: string): string[] {
  return db.topics
    .filter((t) => t.courseId === courseId)
    .flatMap((t) => db.content.get(t.id)?.qa.map(([, a]) => a) ?? []);
}

function finalize(topic: Topic): void {
  if (topic.status === 'ready' && db.ai.has(topic.id)) return;
  const content = db.content.get(topic.id) ?? contentFromTitle(topic.title);
  db.content.set(topic.id, content);
  const answers = [
    ...courseAnswers(topic.courseId),
    ...contentFromTitle('it').qa.map(([, a]) => a),
  ];
  db.ai.set(topic.id, generateTopicAi(topic.id, topic.title, content, topic.durationSec, answers));
  topic.status = 'ready';
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  topic.nextReviewAt ??= tomorrow.toISOString();
  topic.updatedAt = new Date().toISOString();
}

/** Derives the client-visible job state from elapsed time; applies side effects on completion. */
export function deriveJob(job: JobRecord): ProcessingJob | null {
  const topic = db.topics.find((t) => t.id === job.topicId);
  if (!topic) return null;
  const elapsed = Date.now() - job.startedAtMs;
  const base = {
    id: job.id,
    topicId: job.topicId,
    attempt: job.attempt,
    startedAt: new Date(job.startedAtMs).toISOString(),
  };

  if (job.failAt) {
    const failIndex = PROCESSING_STAGES.indexOf(job.failAt);
    if (elapsed >= (failIndex + 0.6) * STAGE_MS) {
      topic.status = 'failed';
      return {
        ...base,
        stage: 'failed',
        failedStage: job.failAt,
        error: `The AI model timed out while generating ${job.failAt}. Retrying usually fixes this.`,
        progress: Math.round((failIndex / WORK_STAGES) * 100),
      };
    }
  }

  const index = Math.min(Math.floor(elapsed / STAGE_MS), WORK_STAGES);
  const stage = PROCESSING_STAGES[index] ?? 'ready';
  if (stage === 'ready') finalize(topic);
  else topic.status = 'processing';
  return {
    ...base,
    stage,
    failedStage: null,
    error: null,
    progress: Math.min(100, Math.round((elapsed / (WORK_STAGES * STAGE_MS)) * 100)),
  };
}

export function startJob(topic: Topic): JobRecord {
  const previous = db.jobs.get(topic.id);
  const attempt = (previous?.attempt ?? 0) + 1;
  const job: JobRecord = {
    id: createId('job'),
    topicId: topic.id,
    startedAtMs: Date.now(),
    attempt,
    failAt: attempt === 1 && FAIL_FIRST_ATTEMPT.has(topic.id) ? 'flashcards' : null,
  };
  db.jobs.set(topic.id, job);
  topic.status = 'processing';
  return job;
}

/** Advances every running job so topic statuses are current wherever topics are read. */
export function syncJobs(): void {
  db.jobs.forEach((job) => deriveJob(job));
}
