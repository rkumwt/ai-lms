import { ArrowLeft } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseHeader } from '@/features/courses/components/detail/CourseHeader';
import { CourseNotesTab } from '@/features/courses/components/detail/CourseNotesTab';
import { QuizHistoryTab } from '@/features/courses/components/detail/QuizHistoryTab';
import { useCourse } from '@/features/courses/hooks/useCourses';
import { SortableTopicList } from '@/features/topics/components/SortableTopicList';

const TABS = ['topics', 'notes', 'quiz'] as const;
type Tab = (typeof TABS)[number];

export default function CourseDetailPage() {
  const { courseId = '' } = useParams();
  const course = useCourse(courseId);
  const [params, setParams] = useSearchParams();
  const tab: Tab = TABS.find((t) => t === params.get('tab')) ?? 'topics';

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to="/courses">
          <ArrowLeft aria-hidden /> All courses
        </Link>
      </Button>

      {course.isPending && (
        <div
          className="flex flex-col gap-6 md:flex-row"
          aria-busy="true"
          aria-label="Loading course"
        >
          <Skeleton className="aspect-[16/8] w-full rounded-xl md:w-72" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-2 w-full max-w-md" />
          </div>
        </div>
      )}
      {course.error && (
        <ErrorState
          title="Could not load this course"
          error={course.error}
          onRetry={() => void course.refetch()}
        />
      )}

      {course.data && (
        <>
          <CourseHeader course={course.data} />
          <Tabs
            value={tab}
            onValueChange={(v) => setParams(v === 'topics' ? {} : { tab: v }, { replace: true })}
          >
            <TabsList>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="quiz">Quiz history</TabsTrigger>
            </TabsList>
            <TabsContent value="topics" className="mt-4">
              <SortableTopicList courseId={courseId} />
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <CourseNotesTab courseId={courseId} />
            </TabsContent>
            <TabsContent value="quiz" className="mt-4">
              <QuizHistoryTab courseId={courseId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
