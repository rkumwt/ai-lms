import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  askAi,
  getSuggestedQuestions,
  getTopicAi,
  regenerateSection,
  suggestInterviewQuestions,
  suggestKeyPoints,
  suggestOutline,
  updateTopicAi,
} from '@/api/ai';
import { queryKeys } from '@/lib/queryKeys';
import type { AiSection, OutlineSuggestionInput, TopicAi } from '@/types';

export function useTopicAi(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.ai.topic(topicId ?? ''),
    queryFn: () => getTopicAi(topicId ?? ''),
    enabled: Boolean(topicId),
  });
}

type AiPatch = Parameters<typeof updateTopicAi>[1];

export function useUpdateTopicAi(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: AiPatch) => updateTopicAi(topicId, patch),
    onSuccess: (ai: TopicAi) => queryClient.setQueryData(queryKeys.ai.topic(topicId), ai),
  });
}

export function useRegenerateSection(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (section: AiSection) => regenerateSection(topicId, section),
    onSuccess: (ai: TopicAi) => queryClient.setQueryData(queryKeys.ai.topic(topicId), ai),
  });
}

export function useSuggestOutline() {
  return useMutation({ mutationFn: (input: OutlineSuggestionInput) => suggestOutline(input) });
}

export function useSuggestKeyPoints() {
  return useMutation({
    mutationFn: ({ title, notesHtml }: { title: string; notesHtml: string }) =>
      suggestKeyPoints(title, notesHtml),
  });
}

export function useSuggestInterviewQuestions() {
  return useMutation({ mutationFn: (title: string) => suggestInterviewQuestions(title) });
}

export function useAskAi() {
  return useMutation({ mutationFn: (question: string) => askAi(question) });
}

export function useSuggestedQuestions() {
  return useQuery({
    queryKey: queryKeys.ai.suggestions,
    queryFn: getSuggestedQuestions,
    staleTime: Infinity,
  });
}
