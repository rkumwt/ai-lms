import { db } from '@/mocks/db';
import { deriveJob, startJob } from '@/mocks/pipeline';
import { createId } from '@/mocks/utils';
import type { ProcessingJob, Topic, UploadRecordingInput } from '@/types';

import { ApiError, mockRequest, notFound } from './client';

function findTopic(id: string): Topic {
  return db.topics.find((t) => t.id === id) ?? notFound('Topic');
}

function jobFor(topic: Topic): ProcessingJob {
  const job = deriveJob(startJob(topic));
  if (!job) notFound('Topic');
  return job;
}

/** "Uploads" a local recording (the Blob stays in the browser) and starts AI processing. */
export const uploadRecording = (input: UploadRecordingInput) =>
  mockRequest(() => {
    const topic = findTopic(input.topicId);
    const videoId = createId('v');
    db.videos = db.videos.filter((v) => v.topicId !== topic.id);
    db.videos.push({
      id: videoId,
      topicId: topic.id,
      url: input.blobUrl,
      durationSec: input.durationSec,
      createdAt: new Date().toISOString(),
    });
    db.ai.delete(topic.id);
    Object.assign(topic, {
      videoId,
      durationSec: Math.round(input.durationSec),
      status: 'recorded',
    });
    return jobFor(topic);
  });

/** Current processing state for a topic, or null if it was never processed. */
export const getProcessingJob = (topicId: string) =>
  mockRequest<ProcessingJob | null>(() => {
    const job = db.jobs.get(topicId);
    return job ? deriveJob(job) : null;
  });

export const startProcessing = (topicId: string) =>
  mockRequest(() => {
    const topic = findTopic(topicId);
    if (!topic.videoId) throw new ApiError('Record a video before processing', 400);
    return jobFor(topic);
  });

export const retryProcessing = startProcessing;
