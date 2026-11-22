import { BookOpen, Plus, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import type { CourseView } from '@/stores/preferencesStore';
import type { CourseSummary } from '@/types';

import { CourseCard, CourseCardSkeleton } from './CourseCard';
import { CourseRow, CourseRowSkeleton } from './CourseRow';

interface CourseCollectionProps {
  view: CourseView;
  courses: CourseSummary[] | undefined;
  isPending: boolean;
  error: Error | null;
  hasFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
}

const GRID = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3';

export function CourseCollection({
  view,
  courses,
  isPending,
  error,
  hasFilters,
  onRetry,
  onClearFilters,
}: CourseCollectionProps) {
  if (isPending) {
    return view === 'grid' ? (
      <div className={GRID} aria-busy="true" aria-label="Loading courses">
        {Array.from({ length: 6 }, (_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    ) : (
      <ul className="space-y-2" aria-busy="true" aria-label="Loading courses">
        {Array.from({ length: 5 }, (_, i) => (
          <CourseRowSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (error) return <ErrorState title="Could not load courses" error={error} onRetry={onRetry} />;

  if (!courses?.length) {
    return hasFilters ? (
      <EmptyState
        icon={SearchX}
        title="No courses match your filters"
        description="Try removing a filter or searching for something else."
        action={
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={BookOpen}
        title="No courses yet"
        description="Create your first course, add topics, and record yourself explaining them."
        action={
          <Button asChild>
            <Link to="/courses/new">
              <Plus aria-hidden /> New course
            </Link>
          </Button>
        }
      />
    );
  }

  return view === 'grid' ? (
    <div className={GRID}>
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  ) : (
    <ul className="space-y-2">
      {courses.map((c) => (
        <CourseRow key={c.id} course={c} />
      ))}
    </ul>
  );
}
