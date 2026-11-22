import type { RecordingQuality, RecordingSource } from '@/types';

export interface RecordingConfig {
  topicId: string;
  source: RecordingSource;
  micId: string | null;
  cameraId: string | null;
  countdown: boolean;
  teleprompter: boolean;
  quality: RecordingQuality;
}

export interface RecordingResult {
  topicId: string;
  blobUrl: string;
  mimeType: string;
  sizeBytes: number;
  durationSec: number;
  createdAt: string;
}

export type RecorderStatus =
  'idle' | 'acquiring' | 'countdown' | 'recording' | 'paused' | 'stopping' | 'error';

export type MediaErrorKind =
  'permission' | 'cancelled' | 'no-device' | 'busy' | 'unsupported' | 'unknown';

export interface MediaErrorInfo {
  kind: MediaErrorKind;
  title: string;
  message: string;
}

/** Bubble position as fractions of the stage (centre point) plus diameter as a fraction of stage height. */
export interface BubbleState {
  x: number;
  y: number;
  size: number;
}

export const needsDisplay = (source: RecordingSource) => source !== 'camera';
export const needsCamera = (source: RecordingSource) => source !== 'screen';
