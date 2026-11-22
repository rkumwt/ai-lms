import type { CourseFilters } from '@/types';

/** Central query-key factory so invalidation stays consistent across features. */
export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    list: (filters: CourseFilters) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    stats: ['courses', 'stats'] as const,
  },
  categories: ['categories'] as const,
  tags: ['tags'] as const,
  topics: {
    all: ['topics'] as const,
    byCourse: (courseId: string) => ['topics', 'course', courseId] as const,
    detail: (id: string) => ['topics', 'detail', id] as const,
    video: (id: string) => ['topics', 'video', id] as const,
  },
  ai: {
    topic: (topicId: string) => ['ai', 'topic', topicId] as const,
    job: (topicId: string) => ['ai', 'job', topicId] as const,
    suggestions: ['ai', 'suggested-questions'] as const,
  },
  revision: {
    all: ['revision'] as const,
    due: ['revision', 'due'] as const,
    recap: ['revision', 'recap'] as const,
    attempts: (courseId: string) => ['revision', 'attempts', courseId] as const,
  },
  search: (q: string) => ['search', q] as const,
  settings: ['settings'] as const,
};
