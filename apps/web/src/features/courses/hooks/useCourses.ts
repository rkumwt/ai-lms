import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCategory,
  createCourse,
  deleteCourse,
  duplicateCourse,
  getCourse,
  getCourseStats,
  listCategories,
  listCourses,
  listTags,
  setCourseArchived,
  updateCourse,
} from '@/api/courses';
import { queryKeys } from '@/lib/queryKeys';
import type { CourseFilters, CourseInput } from '@/types';

export function useCourses(filters: CourseFilters) {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => listCourses(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId ?? ''),
    queryFn: () => getCourse(courseId ?? ''),
    enabled: Boolean(courseId),
  });
}

export function useCourseStats() {
  return useQuery({ queryKey: queryKeys.courses.stats, queryFn: getCourseStats });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: listCategories,
    staleTime: 5 * 60_000,
  });
}

export function useTags() {
  return useQuery({ queryKey: queryKeys.tags, queryFn: listTags, staleTime: 60_000 });
}

/** Invalidates everything derived from courses (lists, stats, tags, topics). */
function useInvalidateCourses() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.tags }),
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.revision.all }),
    ]);
}

export function useCreateCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: (input: CourseInput) => createCourse(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCourse(courseId: string) {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: (input: CourseInput) => updateCourse(courseId, input),
    onSuccess: invalidate,
  });
}

export function useDuplicateCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: (courseId: string) => duplicateCourse(courseId),
    onSuccess: invalidate,
  });
}

export function useArchiveCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: ({ courseId, archived }: { courseId: string; archived: boolean }) =>
      setCourseArchived(courseId, archived),
    onSuccess: invalidate,
  });
}

export function useDeleteCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: invalidate,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}
