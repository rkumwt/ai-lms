import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import {
  getProcessingJob,
  retryProcessing,
  startProcessing,
  uploadRecording,
} from '@/api/processing';
import { useInvalidateTopicData } from '@/features/topics/hooks/useTopics';
import { queryKeys } from '@/lib/queryKeys';
import type { UploadRecordingInput } from '@/types';

const POLL_MS = 1000;

/** Polls the processing job every second until it is ready or failed. */
export function useProcessingJob(topicId: string | undefined) {
  const invalidateTopic = useInvalidateTopicData();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.ai.job(topicId ?? ''),
    queryFn: () => getProcessingJob(topicId ?? ''),
    enabled: Boolean(topicId),
    // Keep polling while the tab is hidden; users often switch away during processing.
    refetchIntervalInBackground: true,
    refetchInterval: (q) => {
      const stage = q.state.data?.stage;
      return stage && stage !== 'ready' && stage !== 'failed' ? POLL_MS : false;
    },
  });

  // When the job reaches a terminal state, refresh the topic, AI results and course data once.
  const stage = query.data?.stage;
  const lastStage = useRef(stage);
  useEffect(() => {
    if (stage !== lastStage.current && (stage === 'ready' || stage === 'failed')) {
      void invalidateTopic();
      if (topicId) void queryClient.invalidateQueries({ queryKey: queryKeys.ai.topic(topicId) });
    }
    lastStage.current = stage;
  }, [stage, topicId, invalidateTopic, queryClient]);

  return query;
}

export function useUploadRecording() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadRecordingInput) => uploadRecording(input),
    onSuccess: (job) => {
      queryClient.setQueryData(queryKeys.ai.job(job.topicId), job);
      queryClient.removeQueries({ queryKey: queryKeys.ai.topic(job.topicId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });
}

function useStartJob(fn: (topicId: string) => ReturnType<typeof startProcessing>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (job) => {
      queryClient.setQueryData(queryKeys.ai.job(job.topicId), job);
      void queryClient.invalidateQueries({ queryKey: queryKeys.topics.detail(job.topicId) });
    },
  });
}

export const useStartProcessing = () => useStartJob(startProcessing);
export const useRetryProcessing = () => useStartJob(retryProcessing);
