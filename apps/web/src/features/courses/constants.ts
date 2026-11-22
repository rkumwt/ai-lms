import type { CourseLevel, CourseSort, CourseStatus, RevisionFilter } from '@/types';

export const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export const REVISION_OPTIONS: { value: RevisionFilter; label: string }[] = [
  { value: 'due', label: 'Due today' },
  { value: 'up_to_date', label: 'Up to date' },
];

export const SORT_OPTIONS: { value: CourseSort; label: string }[] = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'progress', label: 'Progress' },
  { value: 'az', label: 'A–Z' },
];

export const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

/** Sentinel for "no filter" in Radix Select, which does not allow empty values. */
export const ALL = 'all';
