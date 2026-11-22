import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarClock, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { DragHandle } from '@/components/DragHandle';
import { TopicStatusBadge } from '@/components/StatusBadge';
import { formatReviewDate, formatTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Topic } from '@/types';

import { topicHref } from '../topicLinks';

import { TopicActionsMenu } from './TopicActionsMenu';

function isDueOrOverdue(iso: string | null) {
  if (!iso) return false;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return new Date(iso) <= end;
}

export function TopicRow({ topic, sortable = true }: { topic: Topic; sortable?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: topic.id,
    disabled: !sortable,
  });
  const due = topic.status === 'ready' && isDueOrOverdue(topic.nextReviewAt);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative flex items-center gap-2 rounded-lg border bg-card p-2 pr-1 shadow-soft transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-soft-lg sm:gap-3 sm:p-3 sm:pr-2',
        isDragging && 'z-10 shadow-soft-lg',
      )}
    >
      {sortable && (
        <DragHandle
          label={`Reorder ${topic.title}`}
          attributes={attributes}
          listeners={listeners}
          className="relative z-10"
        />
      )}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
        {topic.order}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <Link
          to={topicHref(topic)}
          title={topic.title}
          className="block truncate font-medium outline-none after:absolute after:inset-0 after:content-['']"
        >
          {topic.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:hidden">
          <TopicStatusBadge status={topic.status} />
          {topic.durationSec > 0 && <span>{formatTimestamp(topic.durationSec)}</span>}
          {topic.status === 'ready' && (
            <span className={cn(due && 'font-medium text-amber-600 dark:text-warning')}>
              Review: {formatReviewDate(topic.nextReviewAt)}
            </span>
          )}
        </div>
      </div>

      <div className="hidden w-28 shrink-0 md:block">
        <TopicStatusBadge status={topic.status} />
      </div>
      <span className="hidden w-16 shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground md:inline-flex">
        <Clock3 className="size-3.5" aria-hidden />
        {topic.durationSec ? formatTimestamp(topic.durationSec) : '—'}
      </span>
      <div className="hidden w-16 shrink-0 lg:block">
        <ConfidenceBadge confidence={topic.confidence} />
      </div>
      <span
        className={cn(
          'hidden w-32 shrink-0 items-center gap-1 text-xs text-muted-foreground md:inline-flex',
          due && 'font-medium text-amber-600 dark:text-warning',
        )}
      >
        <CalendarClock className="size-3.5" aria-hidden />
        {topic.status === 'ready' ? formatReviewDate(topic.nextReviewAt) : '—'}
      </span>
      <TopicActionsMenu topic={topic} />
    </li>
  );
}
