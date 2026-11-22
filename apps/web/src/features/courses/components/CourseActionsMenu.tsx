import { Archive, ArchiveRestore, Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { CourseSummary } from '@/types';

import { useArchiveCourse, useDeleteCourse, useDuplicateCourse } from '../hooks/useCourses';

interface CourseActionsMenuProps {
  course: CourseSummary;
  className?: string;
  /** Called after delete succeeds (e.g. navigate away from the detail page). */
  onDeleted?: () => void;
}

export function CourseActionsMenu({ course, className, onDeleted }: CourseActionsMenuProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const duplicate = useDuplicateCourse();
  const archive = useArchiveCourse();
  const remove = useDeleteCourse();

  const onDuplicate = () =>
    duplicate.mutate(course.id, {
      onSuccess: (copy) =>
        toast.success('Course duplicated', {
          description: copy.title,
          action: { label: 'Open', onClick: () => navigate(`/courses/${copy.id}`) },
        }),
      onError: (e) => toast.error('Could not duplicate course', { description: e.message }),
    });

  const onArchive = (archived: boolean) =>
    archive.mutate(
      { courseId: course.id, archived },
      {
        onSuccess: () =>
          toast.success(archived ? 'Course archived' : 'Course restored', {
            action: archived
              ? {
                  label: 'Undo',
                  onClick: () => archive.mutate({ courseId: course.id, archived: false }),
                }
              : undefined,
          }),
        onError: (e) => toast.error('Could not update course', { description: e.message }),
      },
    );

  const onDelete = () =>
    remove.mutate(course.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast.success('Course deleted', { description: course.title });
        onDeleted?.();
      },
      onError: (e) => toast.error('Could not delete course', { description: e.message }),
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('relative z-10 size-8', className)}
            aria-label={`Actions for ${course.title}`}
          >
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => navigate(`/courses/${course.id}/edit`)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDuplicate} disabled={duplicate.isPending}>
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onArchive(!course.archived)}>
            {course.archived ? <ArchiveRestore /> : <Archive />}
            {course.archived ? 'Restore' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this course?"
        description={
          <>
            <strong className="text-foreground">{course.title}</strong> and its {course.topicCount}{' '}
            topics, recordings and AI notes will be removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete course"
        destructive
        loading={remove.isPending}
        onConfirm={onDelete}
      />
    </>
  );
}
