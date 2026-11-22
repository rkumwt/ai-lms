import type {
  Confidence,
  Course,
  CourseStatus,
  CourseSummary,
  Topic,
  TopicWithCourse,
} from '@/types';

import { db } from './db';
import { dateOnly, endOfToday } from './utils';

export const REVIEW_INTERVAL_DAYS: Record<Confidence, number> = { weak: 1, okay: 3, strong: 7 };

export function isDue(topic: Topic): boolean {
  return (
    topic.status === 'ready' &&
    topic.nextReviewAt !== null &&
    new Date(topic.nextReviewAt).getTime() <= endOfToday()
  );
}

export function topicsOf(courseId: string): Topic[] {
  return db.topics.filter((t) => t.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function withCourse(topic: Topic): TopicWithCourse {
  const course = db.courses.find((c) => c.id === topic.courseId);
  return { ...topic, courseTitle: course?.title ?? 'Unknown course' };
}

export function summarizeCourse(course: Course): CourseSummary {
  const topics = topicsOf(course.id);
  const ready = topics.filter((t) => t.status === 'ready').length;
  const recorded = topics.filter((t) => t.status !== 'draft').length;
  const progress = topics.length ? Math.round((ready / topics.length) * 100) : 0;
  let status: CourseStatus = 'in_progress';
  if (recorded === 0) status = 'not_started';
  else if (ready === topics.length) status = 'completed';

  return {
    ...course,
    categoryName: db.categories.find((c) => c.id === course.categoryId)?.name ?? 'Uncategorised',
    topicCount: topics.length,
    recordedCount: recorded,
    totalDurationSec: topics.reduce((sum, t) => sum + t.durationSec, 0),
    progress,
    dueCount: topics.filter(isDue).length,
    status,
  };
}

/** Consecutive study days ending today (or yesterday if nothing studied yet today). */
export function streakDays(): number {
  const day = new Date();
  if (!db.studyDays.has(dateOnly(day.toISOString()))) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (db.studyDays.has(dateOnly(day.toISOString()))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function markStudiedToday(): void {
  db.studyDays.add(dateOnly(new Date().toISOString()));
}

export function scheduleReview(topic: Topic, confidence: Confidence): void {
  const next = new Date();
  next.setDate(next.getDate() + REVIEW_INTERVAL_DAYS[confidence]);
  next.setHours(8, 0, 0, 0);
  topic.confidence = confidence;
  topic.nextReviewAt = next.toISOString();
  topic.lastReviewedAt = new Date().toISOString();
  topic.updatedAt = new Date().toISOString();
}
