import { BookOpen, Clock, Flame, Video, type LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useCourseStats } from '../hooks/useCourses';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint: string;
  tone?: 'default' | 'warning' | 'success';
}

function StatCard({ icon: Icon, label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 shadow-soft">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
          tone === 'warning' && 'bg-warning/15 text-amber-600 dark:text-warning',
          tone === 'success' && 'bg-success/10 text-success',
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </Card>
  );
}

export function StatsRow() {
  const { data, isPending, isError } = useCourseStats();

  if (isPending || isError) {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-busy={isPending}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Study stats" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard
        icon={BookOpen}
        label="Total courses"
        value={data.totalCourses}
        hint="Active courses"
      />
      <StatCard
        icon={Video}
        label="Recorded this week"
        value={data.topicsThisWeek}
        hint="Topics in the last 7 days"
      />
      <StatCard
        icon={Flame}
        label="Study streak"
        value={`${data.streakDays}d`}
        hint={data.streakDays ? 'Keep it going!' : 'Study today to start one'}
        tone="success"
      />
      <StatCard
        icon={Clock}
        label="Due today"
        value={data.dueToday}
        hint={data.dueToday ? 'Topics to revise' : 'All caught up'}
        tone={data.dueToday ? 'warning' : 'default'}
      />
    </section>
  );
}
