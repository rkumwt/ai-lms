import { ListPlus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { SortableList } from '@/components/SortableList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useReorderTopics, useTopics } from '../hooks/useTopics';

import { TopicRow } from './TopicRow';

export function SortableTopicList({ courseId }: { courseId: string }) {
  const topics = useTopics(courseId);
  const reorder = useReorderTopics(courseId);

  if (topics.isPending) {
    return (
      <ul className="space-y-2" aria-busy="true" aria-label="Loading topics">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </ul>
    );
  }
  if (topics.error) {
    return (
      <ErrorState
        title="Could not load topics"
        error={topics.error}
        onRetry={() => void topics.refetch()}
      />
    );
  }
  if (!topics.data.length) {
    return (
      <EmptyState
        icon={ListPlus}
        title="No topics yet"
        description="Topics are the chapters of your course. Add one, write notes, then record yourself explaining it."
        action={
          <Button asChild>
            <Link to={`/courses/${courseId}/topics/new`}>
              <Plus aria-hidden /> Add topic
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="hidden gap-3 px-3 text-xs font-medium text-muted-foreground md:flex"
        aria-hidden
      >
        <span className="w-[68px]" />
        <span className="flex-1">Topic</span>
        <span className="w-28">Status</span>
        <span className="w-16">Length</span>
        <span className="hidden w-16 lg:block">Confidence</span>
        <span className="w-32">Next review</span>
        <span className="w-8" />
      </div>
      <SortableList
        items={topics.data}
        getLabel={(t) => t.title}
        onReorder={(next) =>
          reorder.mutate(
            next.map((t) => t.id),
            {
              onError: (e) =>
                toast.error('Could not save the new order', { description: e.message }),
            },
          )
        }
      >
        <ol className="space-y-2" aria-label="Topics in order">
          {topics.data.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </ol>
      </SortableList>
      <p className="px-1 pt-1 text-xs text-muted-foreground">
        Drag the handle to reorder. With a keyboard: focus the handle, press Space, use the arrow
        keys, then press Space again.
      </p>
    </div>
  );
}
