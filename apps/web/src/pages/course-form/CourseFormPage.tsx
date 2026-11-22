import { useIsMutating } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { COURSE_FORM_ID, CourseEditor } from '@/features/courses/components/form/CourseEditor';
import { useCourse } from '@/features/courses/hooks/useCourses';

export default function CourseFormPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(courseId);
  const course = useCourse(courseId);
  const saving = useIsMutating() > 0;
  const backTo = isEdit ? `/courses/${courseId}` : '/courses';

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={backTo}>
          <ArrowLeft aria-hidden /> {isEdit ? 'Back to course' : 'All courses'}
        </Link>
      </Button>
      <PageHeader
        title={isEdit ? 'Edit course' : 'New course'}
        description={isEdit ? course.data?.title : 'Set up a course, then add topics to record.'}
        actions={
          <div className="hidden gap-2 lg:flex">
            <Button variant="outline" onClick={() => navigate(backTo)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form={COURSE_FORM_ID}
              disabled={saving || (isEdit && !course.data)}
            >
              {saving && <Loader2 className="animate-spin" aria-hidden />}
              {isEdit ? 'Save changes' : 'Create course'}
            </Button>
          </div>
        }
      />
      {!isEdit && <CourseEditor />}
      {isEdit && course.isPending && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true">
          <Skeleton className="h-[640px] rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}
      {isEdit && course.error && (
        <ErrorState
          title="Could not load this course"
          error={course.error}
          onRetry={() => void course.refetch()}
        />
      )}
      {isEdit && course.data && <CourseEditor key={course.data.id} course={course.data} />}
    </div>
  );
}
