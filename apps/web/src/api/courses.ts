import { COVER_PALETTES, makeCover } from '@/mocks/covers';
import { db } from '@/mocks/db';
import { isDue, streakDays, summarizeCourse, topicsOf } from '@/mocks/derive';
import { createId } from '@/mocks/utils';
import type {
  Category,
  Course,
  CourseFilters,
  CourseInput,
  CourseStats,
  CourseSummary,
  Topic,
} from '@/types';

import { ApiError, mockRequest, notFound } from './client';

function matches(course: CourseSummary, f: CourseFilters): boolean {
  if (!f.includeArchived && course.archived) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    const haystack = [course.title, course.description, ...course.tags].join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (f.category && course.categoryId !== f.category) return false;
  if (f.tags?.length && !f.tags.every((t) => course.tags.includes(t))) return false;
  if (f.status && course.status !== f.status) return false;
  if (f.revision === 'due' && course.dueCount === 0) return false;
  if (f.revision === 'up_to_date' && course.dueCount > 0) return false;
  const updated = course.updatedAt.slice(0, 10);
  if (f.from && updated < f.from) return false;
  if (f.to && updated > f.to) return false;
  return true;
}

const SORTERS: Record<
  NonNullable<CourseFilters['sort']>,
  (a: CourseSummary, b: CourseSummary) => number
> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  progress: (a, b) => b.progress - a.progress,
  az: (a, b) => a.title.localeCompare(b.title),
};

function findCourse(id: string): Course {
  return db.courses.find((c) => c.id === id) ?? notFound('Course');
}

function draftTopic(courseId: string, title: string, order: number): Topic {
  const now = new Date().toISOString();
  return {
    id: createId('t'),
    courseId,
    order,
    title,
    tags: [],
    notesHtml: '',
    links: [],
    status: 'draft',
    durationSec: 0,
    confidence: null,
    nextReviewAt: null,
    lastReviewedAt: null,
    videoId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export const listCourses = (filters: CourseFilters = {}) =>
  mockRequest(() =>
    db.courses
      .map(summarizeCourse)
      .filter((c) => matches(c, filters))
      .sort(SORTERS[filters.sort ?? 'updated']),
  );

export const getCourse = (id: string) => mockRequest(() => summarizeCourse(findCourse(id)));

export const getCourseStats = () =>
  mockRequest<CourseStats>(() => {
    const weekAgo = Date.now() - 7 * 86_400_000;
    return {
      totalCourses: db.courses.filter((c) => !c.archived).length,
      topicsThisWeek: db.topics.filter(
        (t) => t.status !== 'draft' && new Date(t.updatedAt).getTime() >= weekAgo,
      ).length,
      streakDays: streakDays(),
      dueToday: db.topics.filter(isDue).length,
    };
  });

export const createCourse = (input: CourseInput) =>
  mockRequest(() => {
    const now = new Date().toISOString();
    const { outline = [], ...fields } = input;
    const course: Course = {
      ...fields,
      id: createId('c'),
      coverUrl:
        fields.coverUrl ??
        makeCover(
          fields.title,
          COVER_PALETTES[db.courses.length % COVER_PALETTES.length] ?? ['#6366f1', '#312e81'],
        ),
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    db.courses.push(course);
    outline.forEach((title, i) => db.topics.push(draftTopic(course.id, title, i + 1)));
    return summarizeCourse(course);
  });

export const updateCourse = (id: string, input: CourseInput) =>
  mockRequest(() => {
    const course = findCourse(id);
    const { outline = [], ...fields } = input;
    Object.assign(course, fields, { updatedAt: new Date().toISOString() });
    const start = topicsOf(id).length;
    outline.forEach((title, i) => db.topics.push(draftTopic(id, title, start + i + 1)));
    return summarizeCourse(course);
  });

export const duplicateCourse = (id: string) =>
  mockRequest(() => {
    const source = findCourse(id);
    const now = new Date().toISOString();
    const copy: Course = {
      ...structuredClone(source),
      id: createId('c'),
      title: `${source.title} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    db.courses.push(copy);
    topicsOf(id).forEach((t) => {
      const draft = draftTopic(copy.id, t.title, t.order);
      draft.tags = [...t.tags];
      draft.notesHtml = t.notesHtml;
      db.topics.push(draft);
    });
    return summarizeCourse(copy);
  });

export const setCourseArchived = (id: string, archived: boolean) =>
  mockRequest(() => {
    const course = findCourse(id);
    course.archived = archived;
    course.updatedAt = new Date().toISOString();
    return summarizeCourse(course);
  });

export const deleteCourse = (id: string) =>
  mockRequest(() => {
    findCourse(id);
    db.courses = db.courses.filter((c) => c.id !== id);
    db.topics = db.topics.filter((t) => t.courseId !== id);
    return { id };
  });

export const listCategories = () =>
  mockRequest(() => [...db.categories].sort((a, b) => a.name.localeCompare(b.name)));

export const createCategory = (name: string) =>
  mockRequest<Category>(() => {
    const trimmed = name.trim();
    if (!trimmed) throw new ApiError('Category name is required', 400);
    const existing = db.categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;
    const category = { id: createId('cat'), name: trimmed };
    db.categories.push(category);
    return category;
  });

export const listTags = () =>
  mockRequest(() => {
    const tags = new Set<string>();
    db.courses.forEach((c) => c.tags.forEach((t) => tags.add(t)));
    db.topics.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return [...tags].sort();
  });
