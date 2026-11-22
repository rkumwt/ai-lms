import { db } from '@/mocks/db';
import { withCourse } from '@/mocks/derive';
import type { SearchResult } from '@/types';

import { mockRequest } from './client';

export const searchAll = (query: string) =>
  mockRequest<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const has = (...parts: string[]) => parts.join(' ').toLowerCase().includes(q);

    const courses: SearchResult[] = db.courses
      .filter((c) => !c.archived && has(c.title, c.description, ...c.tags))
      .slice(0, 5)
      .map((c) => ({
        type: 'course',
        id: c.id,
        title: c.title,
        subtitle: `${c.tags.slice(0, 3).join(' · ')}`,
        href: `/courses/${c.id}`,
      }));

    const topics: SearchResult[] = db.topics
      .filter((t) => has(t.title, ...t.tags))
      .slice(0, 8)
      .map((t) => ({
        type: 'topic',
        id: t.id,
        title: t.title,
        subtitle: withCourse(t).courseTitle,
        href: `/topics/${t.id}`,
      }));

    return [...courses, ...topics];
  });
