import { AlertTriangle, BarChart3, Clock, RefreshCcw, Target, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

import { useMonthlyRecap } from '../hooks/useRevision';

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Video;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border p-3">
      <Icon className="mb-2 size-4 text-muted-foreground" aria-hidden />
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function MonthlyRecapCard() {
  const recap = useMonthlyRecap();

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Monthly recap</CardTitle>
        <CardDescription>
          {recap.data
            ? `Last 30 days · ${formatDate(`${recap.data.month}-01`, 'MMMM yyyy')}`
            : 'Last 30 days'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recap.isPending && <Skeleton className="h-72 rounded-lg" />}
        {recap.error && <ErrorState error={recap.error} onRetry={() => void recap.refetch()} />}
        {recap.data && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat icon={Video} label="Topics recorded" value={recap.data.topicsRecorded} />
              <Stat icon={RefreshCcw} label="Reviews done" value={recap.data.reviewsDone} />
              <Stat icon={Clock} label="Minutes recorded" value={recap.data.minutesRecorded} />
              <Stat icon={Target} label="Average score" value={`${recap.data.averageScore}%`} />
            </div>

            <section aria-labelledby="weak-areas" className="space-y-2">
              <h3 id="weak-areas" className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="size-4 text-warning" aria-hidden /> Weak areas
              </h3>
              {recap.data.weakAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No weak areas — every topic is averaging 70% or more.
                </p>
              ) : (
                <ul className="space-y-2">
                  {recap.data.weakAreas.map((w) => (
                    <li key={w.topicId}>
                      <Link
                        to={`/topics/${w.topicId}`}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50',
                          w.averageScore < 50
                            ? 'border-destructive/40 bg-destructive/5'
                            : 'border-warning/40 bg-warning/10',
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{w.topicTitle}</p>
                          <p className="truncate text-xs text-muted-foreground">{w.courseTitle}</p>
                        </div>
                        <span
                          className={cn(
                            'text-sm font-semibold tabular-nums',
                            w.averageScore < 50
                              ? 'text-destructive'
                              : 'text-amber-700 dark:text-warning',
                          )}
                        >
                          {w.averageScore}%
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="by-course" className="space-y-3">
              <h3 id="by-course" className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="size-4 text-muted-foreground" aria-hidden /> Recorded by
                course
              </h3>
              {recap.data.byCourse.length === 0 ? (
                <EmptyState icon={Video} title="Nothing recorded this month" className="py-6" />
              ) : (
                <ul className="space-y-2.5">
                  {recap.data.byCourse.map((c) => {
                    const max = Math.max(...recap.data.byCourse.map((x) => x.topics));
                    return (
                      <li
                        key={c.courseId}
                        className="grid grid-cols-[minmax(0,10rem)_1fr_2rem] items-center gap-3 text-sm"
                      >
                        <span className="truncate text-muted-foreground">{c.courseTitle}</span>
                        <span className="h-2 rounded-full bg-muted" aria-hidden>
                          <span
                            className="block h-2 rounded-full bg-primary"
                            style={{ width: `${(c.topics / max) * 100}%` }}
                          />
                        </span>
                        <span className="text-right tabular-nums">{c.topics}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
