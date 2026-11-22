import { Link } from 'react-router-dom';

import { DueBadge } from '@/components/DueBadge';
import { CourseStatusBadge } from '@/components/StatusBadge';
import { TagList } from '@/components/TagList';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration, formatRelative, pluralize } from '@/lib/format';
import type { CourseSummary } from '@/types';

import { CourseActionsMenu } from './CourseActionsMenu';
import { CourseProgress } from './CourseProgress';

export function CourseRow({ course }: { course: CourseSummary }) {
  return (
    <li className="group relative flex items-center gap-4 rounded-lg border bg-card p-3 shadow-soft transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-soft-lg">
      <div className="hidden h-14 w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
        {course.coverUrl && (
          <img src={course.coverUrl} alt="" className="size-full object-cover" loading="lazy" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">
            <Link
              to={`/courses/${course.id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {course.title}
            </Link>
          </h3>
          <span className="text-xs text-muted-foreground">{course.categoryName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TagList tags={course.tags} />
          <DueBadge count={course.dueCount} />
        </div>
      </div>

      <div className="hidden w-32 shrink-0 text-xs text-muted-foreground md:block">
        <p>{pluralize(course.topicCount, 'topic')}</p>
        <p>{formatDuration(course.totalDurationSec)}</p>
      </div>
      <div className="hidden w-40 shrink-0 space-y-1 lg:block">
        <CourseStatusBadge status={course.status} />
        <CourseProgress value={course.progress} />
      </div>
      <p className="hidden w-28 shrink-0 text-xs text-muted-foreground xl:block">
        {formatRelative(course.updatedAt)}
      </p>
      <CourseActionsMenu course={course} />
    </li>
  );
}

export function CourseRowSkeleton() {
  return (
    <li className="flex items-center gap-4 rounded-lg border p-3">
      <Skeleton className="hidden h-14 w-24 sm:block" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="hidden h-8 w-40 lg:block" />
    </li>
  );
}
