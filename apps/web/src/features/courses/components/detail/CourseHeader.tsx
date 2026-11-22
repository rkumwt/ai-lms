import { CalendarDays, Clock3, Layers, Pencil, Plus, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { DueBadge } from '@/components/DueBadge';
import { CourseStatusBadge } from '@/components/StatusBadge';
import { TagList } from '@/components/TagList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate, formatDuration, pluralize } from '@/lib/format';
import type { CourseSummary } from '@/types';

import { LEVEL_OPTIONS } from '../../constants';
import { CourseActionsMenu } from '../CourseActionsMenu';
import { CourseProgress } from '../CourseProgress';

export function CourseHeader({ course }: { course: CourseSummary }) {
  const navigate = useNavigate();
  const level = LEVEL_OPTIONS.find((l) => l.value === course.level)?.label;

  return (
    <header className="flex flex-col gap-6 md:flex-row">
      <div className="aspect-[16/8] w-full shrink-0 self-start overflow-hidden rounded-xl bg-muted shadow-soft md:w-72">
        {course.coverUrl && <img src={course.coverUrl} alt="" className="size-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.categoryName}</Badge>
          {level && <Badge variant="outline">{level}</Badge>}
          <CourseStatusBadge status={course.status} />
          {course.archived && <Badge variant="outline">Archived</Badge>}
        </div>
        <div className="flex items-start gap-2">
          <h1 className="flex-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {course.title}
          </h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/courses/${course.id}/edit`} aria-label="Edit course">
                  <Pencil aria-hidden />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit course</TooltipContent>
          </Tooltip>
          <CourseActionsMenu course={course} onDeleted={() => navigate('/courses')} />
        </div>
        {course.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{course.description}</p>
        )}
        <TagList tags={course.tags} max={6} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-4" aria-hidden /> {pluralize(course.topicCount, 'topic')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" aria-hidden /> {formatDuration(course.totalDurationSec)}{' '}
            recorded
          </span>
          {course.targetDate && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden /> Target {formatDate(course.targetDate)}
            </span>
          )}
          <DueBadge count={course.dueCount} />
        </div>
        <CourseProgress value={course.progress} className="max-w-md" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild>
            <Link to={`/courses/${course.id}/topics/new`}>
              <Plus aria-hidden /> Add Topic
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/revision/session?course=${course.id}`}>
              <RefreshCcw aria-hidden /> Revise this course
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
