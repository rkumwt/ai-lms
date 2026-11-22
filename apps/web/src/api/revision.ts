import { db } from '@/mocks/db';
import { isDue, markStudiedToday, scheduleReview, withCourse } from '@/mocks/derive';
import { createId, daysBetween } from '@/mocks/utils';
import type { DueQueue, DueTopic, MonthlyRecap, SessionResultInput, WeakArea } from '@/types';

import { mockRequest, notFound } from './client';

/** Summary skim (~1/4 of the video) + ~30 s per flashcard + ~1 min per quiz question. */
function estimateMinutes(topicId: string, durationSec: number): number {
  const ai = db.ai.get(topicId);
  const cards = ai?.flashcards.length ?? 3;
  const questions = Math.min(ai?.quiz.length ?? 3, 5);
  return Math.ceil(durationSec / 240) + Math.ceil(cards * 0.5) + questions;
}

export const getDueQueue = () =>
  mockRequest<DueQueue>(() => {
    const now = Date.now();
    const items: DueTopic[] = db.topics
      .filter(isDue)
      .map((t) => ({
        ...withCourse(t),
        estimatedMinutes: estimateMinutes(t.id, t.durationSec),
        overdueDays: Math.max(0, daysBetween(new Date(t.nextReviewAt ?? now).getTime(), now)),
      }))
      .sort((a, b) => (a.nextReviewAt ?? '').localeCompare(b.nextReviewAt ?? ''));
    return { items, totalMinutes: items.reduce((sum, i) => sum + i.estimatedMinutes, 0) };
  });

export const listQuizAttempts = (courseId: string) =>
  mockRequest(() =>
    db.quizAttempts
      .filter((a) => a.courseId === courseId)
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
  );

export const getMonthlyRecap = () =>
  mockRequest<MonthlyRecap>(() => {
    const month = new Date().toISOString().slice(0, 7);
    const monthAgo = Date.now() - 30 * 86_400_000;
    const recent = db.topics.filter(
      (t) => t.status !== 'draft' && new Date(t.updatedAt).getTime() >= monthAgo,
    );
    const attempts = db.quizAttempts.filter((a) => new Date(a.takenAt).getTime() >= monthAgo);
    const scoreByTopic = new Map<string, number[]>();
    attempts.forEach((a) =>
      scoreByTopic.set(a.topicId, [...(scoreByTopic.get(a.topicId) ?? []), a.score / a.total]),
    );

    const weakAreas: WeakArea[] = [...scoreByTopic.entries()]
      .map(([topicId, scores]) => {
        const topic = db.topics.find((t) => t.id === topicId);
        return {
          topicId,
          topicTitle: topic?.title ?? 'Deleted topic',
          courseTitle: topic ? withCourse(topic).courseTitle : '',
          averageScore: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100),
        };
      })
      .filter((w) => w.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore);

    const byCourse = db.courses
      .map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        topics: recent.filter((t) => t.courseId === c.id).length,
      }))
      .filter((c) => c.topics > 0);

    const totalScore = attempts.reduce((s, a) => s + a.score / a.total, 0);
    return {
      month,
      topicsRecorded: recent.length,
      reviewsDone: attempts.length,
      minutesRecorded: Math.round(recent.reduce((s, t) => s + t.durationSec, 0) / 60),
      averageScore: attempts.length ? Math.round((totalScore / attempts.length) * 100) : 0,
      weakAreas,
      byCourse,
    };
  });

/** Saves a study-session result and reschedules the topic based on the score. */
export const recordSessionResult = ({ topicId, score, total }: SessionResultInput) =>
  mockRequest(() => {
    const topic = db.topics.find((t) => t.id === topicId) ?? notFound('Topic');
    const ratio = total ? score / total : 0;
    scheduleReview(topic, ratio >= 0.8 ? 'strong' : ratio >= 0.5 ? 'okay' : 'weak');
    db.quizAttempts.push({
      id: createId('qa'),
      courseId: topic.courseId,
      topicId,
      topicTitle: topic.title,
      score,
      total,
      takenAt: new Date().toISOString(),
    });
    markStudiedToday();
    return withCourse(topic);
  });
