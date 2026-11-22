import { Clock3, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

import { DueBadge } from '@/components/DueBadge';
import { TagList } from '@/components/TagList';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration, formatRelative, pluralize } from '@/lib/format';
import type { CourseSummary } from '@/types';

import { CourseActionsMenu } from './CourseActionsMenu';
import { CourseProgress } from './CourseProgress';

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Card className="group relative flex flex-col overflow-hidden shadow-soft transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-soft-lg">
      <div className="relative aspect-[16/8] overflow-hidden bg-muted">
        {course.coverUrl && (
          <img
            src={course.coverUrl}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        <Badge variant="secondary" className="absolute left-3 top-3 bg-background/90 backdrop-blur">
          {course.categoryName}
        </Badge>
        {course.archived && (
          <Badge variant="outline" className="absolute right-3 top-3 bg-background/90">
            Archived
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <h3 className="line-clamp-2 flex-1 font-semibold leading-snug">
            <Link
              to={`/courses/${course.id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {course.title}
            </Link>
          </h3>
          <CourseActionsMenu course={course} className="-mr-2 -mt-1" />
        </div>

        <TagList tags={course.tags} />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5" aria-hidden /> {pluralize(course.topicCount, 'topic')}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" aria-hidden /> {formatDuration(course.totalDurationSec)}
          </span>
          <DueBadge count={course.dueCount} />
        </div>

        <div className="mt-auto space-y-2 pt-1">
          <CourseProgress value={course.progress} />
          <p className="text-xs text-muted-foreground">
            Updated {formatRelative(course.updatedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-soft">
      <Skeleton className="aspect-[16/8] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-1.5 w-full" />
      </div>
    </Card>
  );
}
