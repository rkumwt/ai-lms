import { db } from '@/mocks/db';
import { scheduleReview, topicsOf, withCourse } from '@/mocks/derive';
import { createId } from '@/mocks/utils';
import type { Confidence, Topic, TopicInput, Video } from '@/types';

import { mockRequest, notFound } from './client';

function findTopic(id: string): Topic {
  return db.topics.find((t) => t.id === id) ?? notFound('Topic');
}

function touchCourse(courseId: string): void {
  const course = db.courses.find((c) => c.id === courseId);
  if (course) course.updatedAt = new Date().toISOString();
}

function renumber(courseId: string): void {
  topicsOf(courseId).forEach((t, i) => {
    t.order = i + 1;
  });
}

export const listTopics = (courseId: string) =>
  mockRequest(() => {
    if (!db.courses.some((c) => c.id === courseId)) notFound('Course');
    return topicsOf(courseId);
  });

export const getTopic = (id: string) => mockRequest(() => withCourse(findTopic(id)));

export const getTopicVideo = (topicId: string) =>
  mockRequest<Video | null>(() => {
    const topic = findTopic(topicId);
    return db.videos.find((v) => v.id === topic.videoId) ?? null;
  });

export const createTopic = (courseId: string, input: TopicInput) =>
  mockRequest(() => {
    if (!db.courses.some((c) => c.id === courseId)) notFound('Course');
    const now = new Date().toISOString();
    const topic: Topic = {
      ...input,
      id: createId('t'),
      courseId,
      order: topicsOf(courseId).length + 1,
      status: 'draft',
      durationSec: 0,
      confidence: null,
      nextReviewAt: null,
      lastReviewedAt: null,
      videoId: null,
      createdAt: now,
      updatedAt: now,
    };
    db.topics.push(topic);
    touchCourse(courseId);
    return withCourse(topic);
  });

export const updateTopic = (id: string, input: Partial<TopicInput>) =>
  mockRequest(() => {
    const topic = findTopic(id);
    Object.assign(topic, input, { updatedAt: new Date().toISOString() });
    touchCourse(topic.courseId);
    return withCourse(topic);
  });

export const deleteTopic = (id: string) =>
  mockRequest(() => {
    const topic = findTopic(id);
    db.topics = db.topics.filter((t) => t.id !== id);
    db.ai.delete(id);
    db.jobs.delete(id);
    renumber(topic.courseId);
    touchCourse(topic.courseId);
    return { id, courseId: topic.courseId };
  });

export const reorderTopics = (courseId: string, orderedIds: string[]) =>
  mockRequest(() => {
    orderedIds.forEach((id, i) => {
      const topic = db.topics.find((t) => t.id === id && t.courseId === courseId);
      if (topic) topic.order = i + 1;
    });
    touchCourse(courseId);
    return topicsOf(courseId);
  });

export const setTopicConfidence = (id: string, confidence: Confidence) =>
  mockRequest(() => {
    const topic = findTopic(id);
    scheduleReview(topic, confidence);
    return withCourse(topic);
  });
