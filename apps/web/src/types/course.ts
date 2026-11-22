export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'not_started' | 'in_progress' | 'completed';
export type CourseSort = 'updated' | 'progress' | 'az';
export type RevisionFilter = 'due' | 'up_to_date';

export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  coverUrl: string | null;
  level: CourseLevel;
  /** ISO date (yyyy-MM-dd) */
  targetDate: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Course plus values derived from its topics (what list/detail views render). */
export interface CourseSummary extends Course {
  categoryName: string;
  topicCount: number;
  recordedCount: number;
  totalDurationSec: number;
  /** 0–100, share of topics that are ready */
  progress: number;
  dueCount: number;
  status: CourseStatus;
}

export interface CourseFilters {
  q?: string;
  category?: string;
  tags?: string[];
  status?: CourseStatus;
  revision?: RevisionFilter;
  /** ISO date, inclusive, compared to updatedAt */
  from?: string;
  to?: string;
  sort?: CourseSort;
  includeArchived?: boolean;
}

export interface CourseInput {
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  coverUrl: string | null;
  level: CourseLevel;
  targetDate: string | null;
  /** Topic titles to create with the course (from the AI outline panel). */
  outline?: string[];
}

export interface CourseStats {
  totalCourses: number;
  topicsThisWeek: number;
  streakDays: number;
  dueToday: number;
}
