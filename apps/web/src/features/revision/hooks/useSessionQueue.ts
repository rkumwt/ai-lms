import { useEffect, useState } from 'react';

import { useCourse } from '@/features/courses/hooks/useCourses';
import { useTopics } from '@/features/topics/hooks/useTopics';

import { useDueQueue } from './useRevision';

export interface SessionItem {
  topicId: string;
  title: string;
  courseTitle: string;
}

const MAX_TOPICS = 10;

/**
 * Builds the session queue once and freezes it, so topics don't vanish mid-session
 * when finishing one reschedules it. With a course id, falls back to that course's
 * ready topics when none are due ("Revise this course").
 */
export function useSessionQueue(courseId: string | undefined) {
  const due = useDueQueue();
  const course = useCourse(courseId);
  const topics = useTopics(courseId);
  const [queue, setQueue] = useState<SessionItem[] | null>(null);

  useEffect(() => {
    if (queue || !due.data) return;
    if (courseId && (!topics.data || !course.data)) return;
    let items: SessionItem[] = due.data.items
      .filter((i) => !courseId || i.courseId === courseId)
      .map((i) => ({ topicId: i.id, title: i.title, courseTitle: i.courseTitle }));
    if (courseId && !items.length && topics.data && course.data) {
      const title = course.data.title;
      items = topics.data
        .filter((t) => t.status === 'ready')
        .map((t) => ({ topicId: t.id, title: t.title, courseTitle: title }));
    }
    setQueue(items.slice(0, MAX_TOPICS));
  }, [queue, due.data, courseId, topics.data, course.data]);

  return {
    queue,
    error: due.error ?? course.error ?? topics.error,
    courseTitle: course.data?.title,
  };
}
