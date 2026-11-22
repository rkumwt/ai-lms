import { CheckCircle2, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { pluralize } from '@/lib/format';

import { useDueQueue } from '../hooks/useRevision';

export function DueQueueCard() {
  const queue = useDueQueue();

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">Due today</CardTitle>
          <CardDescription>
            {queue.data
              ? queue.data.items.length
                ? `${pluralize(queue.data.items.length, 'topic')} · about ${queue.data.totalMinutes} min`
                : 'Nothing to revise right now'
              : 'Loading your queue…'}
          </CardDescription>
        </div>
        {queue.data && queue.data.items.length > 0 && (
          <Button asChild>
            <Link to="/revision/session">
              <Play aria-hidden /> Start session
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {queue.isPending && (
          <div className="space-y-2" aria-busy="true" aria-label="Loading due topics">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        )}
        {queue.error && <ErrorState error={queue.error} onRetry={() => void queue.refetch()} />}
        {queue.data && queue.data.items.length === 0 && (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up"
            description="Nothing is due today. Record a new topic or mark confidence on one you just watched."
            className="border-none py-8"
            action={
              <Button variant="outline" asChild>
                <Link to="/courses">Go to courses</Link>
              </Button>
            }
          />
        )}
        {queue.data && queue.data.items.length > 0 && (
          <ol className="divide-y rounded-lg border">
            {queue.data.items.map((item, i) => (
              <li
                key={item.id}
                className="relative flex items-center gap-3 p-3 focus-within:bg-muted/50 hover:bg-muted/50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/topics/${item.id}`}
                    className="block truncate font-medium outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {item.title}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">{item.courseTitle}</p>
                </div>
                <div className="hidden sm:block">
                  <ConfidenceBadge confidence={item.confidence} />
                </div>
                {item.overdueDays > 0 ? (
                  <Badge variant="destructive">{item.overdueDays}d overdue</Badge>
                ) : (
                  <Badge variant="warning">Today</Badge>
                )}
                <span className="hidden w-14 items-center gap-1 text-xs text-muted-foreground md:inline-flex">
                  <Clock className="size-3.5" aria-hidden /> {item.estimatedMinutes}m
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
