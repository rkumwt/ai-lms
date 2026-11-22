import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getDueQueue,
  getMonthlyRecap,
  listQuizAttempts,
  recordSessionResult,
} from '@/api/revision';
import { useInvalidateTopicData } from '@/features/topics/hooks/useTopics';
import { queryKeys } from '@/lib/queryKeys';
import type { SessionResultInput } from '@/types';

export function useDueQueue() {
  return useQuery({ queryKey: queryKeys.revision.due, queryFn: getDueQueue });
}

export function useMonthlyRecap() {
  return useQuery({ queryKey: queryKeys.revision.recap, queryFn: getMonthlyRecap });
}

export function useQuizAttempts(courseId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.revision.attempts(courseId ?? ''),
    queryFn: () => listQuizAttempts(courseId ?? ''),
    enabled: Boolean(courseId),
  });
}

export function useRecordSessionResult() {
  const invalidate = useInvalidateTopicData();
  return useMutation({
    mutationFn: (input: SessionResultInput) => recordSessionResult(input),
    onSuccess: invalidate,
  });
}
