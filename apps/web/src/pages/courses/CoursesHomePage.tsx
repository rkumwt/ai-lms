import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { CourseCollection } from '@/features/courses/components/CourseCollection';
import { ActiveFilterChips } from '@/features/courses/components/filters/ActiveFilterChips';
import { CourseFilterBar } from '@/features/courses/components/filters/CourseFilterBar';
import { StatsRow } from '@/features/courses/components/StatsRow';
import { ViewToggle } from '@/features/courses/components/ViewToggle';
import { useCourseFilters } from '@/features/courses/hooks/useCourseFilters';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { pluralize } from '@/lib/format';
import { usePreferencesStore } from '@/stores/preferencesStore';

export default function CoursesHomePage() {
  const { filters, update, clear, activeCount } = useCourseFilters();
  const courses = useCourses(filters);
  const view = usePreferencesStore((s) => s.courseView);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Study a topic, explain it on camera, and let AI turn it into revision material."
        actions={
          <>
            <ViewToggle />
            <Button asChild>
              <Link to="/courses/new">
                <Plus aria-hidden /> New Course
              </Link>
            </Button>
          </>
        }
      />

      <StatsRow />

      <section aria-label="Courses" className="space-y-4">
        <CourseFilterBar
          filters={filters}
          update={update}
          clear={clear}
          activeCount={activeCount}
          resultCount={courses.data?.length}
        />
        <ActiveFilterChips filters={filters} update={update} clear={clear} />
        {courses.data && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {pluralize(courses.data.length, 'course')}
            {courses.isFetching && !courses.isPending && ' · updating…'}
          </p>
        )}
        <CourseCollection
          view={view}
          courses={courses.data}
          isPending={courses.isPending}
          error={courses.error}
          hasFilters={activeCount > 0}
          onRetry={() => void courses.refetch()}
          onClearFilters={clear}
        />
      </section>
    </div>
  );
}
