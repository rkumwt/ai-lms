import type { Topic } from '@/types';

/** Where clicking a topic should go, depending on its status. */
export function topicHref(topic: Pick<Topic, 'id' | 'status'>): string {
  switch (topic.status) {
    case 'ready':
      return `/topics/${topic.id}`;
    case 'recorded':
    case 'processing':
    case 'failed':
      return `/topics/${topic.id}/review`;
    default:
      return `/topics/${topic.id}/edit`;
  }
}
