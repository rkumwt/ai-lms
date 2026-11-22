import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { TopicStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourse } from '@/features/courses/hooks/useCourses';
import { TopicEditor } from '@/features/topics/components/form/TopicEditor';
import { useTopic } from '@/features/topics/hooks/useTopics';

function FormSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      aria-busy="true"
      aria-label="Loading topic"
    >
      <Skeleton className="h-[560px] rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function TopicFormPage() {
  const params = useParams();
  const topic = useTopic(params.topicId);
  const courseId = params.courseId ?? topic.data?.courseId;
  const course = useCourse(courseId);
  const isEdit = Boolean(params.topicId);
  const error = topic.error ?? course.error;
  const loading = (isEdit && topic.isPending) || (Boolean(courseId) && course.isPending);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={courseId ? `/courses/${courseId}` : '/courses'}>
          <ArrowLeft aria-hidden /> {course.data?.title ?? 'Back'}
        </Link>
      </Button>
      <PageHeader
        title={isEdit ? 'Edit topic' : 'New topic'}
        description={
          isEdit && topic.data ? (
            <span className="inline-flex items-center gap-2">
              Topic {topic.data.order} · <TopicStatusBadge status={topic.data.status} />
            </span>
          ) : (
            'Write notes for what you want to explain, then record yourself.'
          )
        }
      />
      {error && (
        <ErrorState
          title="Could not load this topic"
          error={error}
          onRetry={() => void (topic.refetch(), course.refetch())}
        />
      )}
      {!error && loading && <FormSkeleton />}
      {!error && !loading && courseId && (
        <TopicEditor key={topic.data?.id ?? 'new'} courseId={courseId} topic={topic.data} />
      )}
    </div>
  );
}
