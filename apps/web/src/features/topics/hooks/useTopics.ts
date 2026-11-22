import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopicVideo,
  listTopics,
  reorderTopics,
  setTopicConfidence,
  updateTopic,
} from '@/api/topics';
import { queryKeys } from '@/lib/queryKeys';
import type { Confidence, Topic, TopicInput } from '@/types';

export function useTopics(courseId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.topics.byCourse(courseId ?? ''),
    queryFn: () => listTopics(courseId ?? ''),
    enabled: Boolean(courseId),
  });
}

export function useTopic(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.topics.detail(topicId ?? ''),
    queryFn: () => getTopic(topicId ?? ''),
    enabled: Boolean(topicId),
  });
}

export function useTopicVideo(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.topics.video(topicId ?? ''),
    queryFn: () => getTopicVideo(topicId ?? ''),
    enabled: Boolean(topicId),
  });
}

/** Topic changes affect course progress, stats and the revision queue too. */
export function useInvalidateTopicData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.revision.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.tags }),
    ]);
}

export function useCreateTopic(courseId: string) {
  const invalidate = useInvalidateTopicData();
  return useMutation({
    mutationFn: (input: TopicInput) => createTopic(courseId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateTopic(topicId: string) {
  const invalidate = useInvalidateTopicData();
  return useMutation({
    mutationFn: (input: Partial<TopicInput>) => updateTopic(topicId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTopic() {
  const invalidate = useInvalidateTopicData();
  return useMutation({
    mutationFn: (topicId: string) => deleteTopic(topicId),
    onSuccess: invalidate,
  });
}

/** Reorders optimistically so drag-and-drop feels instant; rolls back on error. */
export function useReorderTopics(courseId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.topics.byCourse(courseId);
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderTopics(courseId, orderedIds),
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Topic[]>(key);
      if (previous) {
        const byId = new Map(previous.map((t) => [t.id, t]));
        const next = orderedIds
          .map((id, i) => {
            const topic = byId.get(id);
            return topic ? { ...topic, order: i + 1 } : null;
          })
          .filter((t): t is Topic => t !== null);
        queryClient.setQueryData(key, next);
      }
      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useSetConfidence(topicId: string) {
  const invalidate = useInvalidateTopicData();
  return useMutation({
    mutationFn: (confidence: Confidence) => setTopicConfidence(topicId, confidence),
    onSuccess: invalidate,
  });
}
