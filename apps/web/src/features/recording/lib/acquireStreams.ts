import { toast } from 'sonner';

import { needsCamera, needsDisplay, type MediaErrorInfo, type RecordingConfig } from '../types';

import { QUALITY, deviceConstraint, describeMediaError, stopStream, support } from './media';

export class MediaAcquireError extends Error {
  readonly info: MediaErrorInfo;

  constructor(info: MediaErrorInfo) {
    super(info.message);
    this.name = 'MediaAcquireError';
    this.info = info;
  }
}

export interface AcquiredStreams {
  display: MediaStream | null;
  mic: MediaStream;
  camera: MediaStream | null;
}

/**
 * Requests screen (first, while the click still counts as a user gesture), microphone and camera.
 * On failure, releases anything already acquired and throws a MediaAcquireError.
 */
export async function acquireStreams(
  cfg: RecordingConfig,
  onScreenEnded: () => void,
): Promise<AcquiredStreams> {
  const q = QUALITY[cfg.quality];
  let display: MediaStream | null = null;
  let mic: MediaStream | null = null;
  let camera: MediaStream | null = null;
  const abort = (e: unknown, what: Parameters<typeof describeMediaError>[1]): never => {
    [display, mic, camera].forEach(stopStream);
    throw new MediaAcquireError(describeMediaError(e, what));
  };

  if (needsDisplay(cfg.source)) {
    try {
      if (!support.display)
        throw new DOMException('Screen capture is not supported', 'NotSupportedError');
      const whiteboard = cfg.source === 'whiteboard';
      display = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: q.width }, height: { ideal: q.height }, frameRate: { ideal: 30 } },
        audio: false,
        preferCurrentTab: whiteboard,
        selfBrowserSurface: whiteboard ? 'include' : 'exclude',
        surfaceSwitching: 'include',
      } as DisplayMediaStreamOptions);
      // The browser's own "Stop sharing" button ends the recording.
      display.getVideoTracks()[0]?.addEventListener('ended', onScreenEnded);
    } catch (e) {
      abort(e, 'screen');
    }
  }

  try {
    mic = await navigator.mediaDevices.getUserMedia({
      audio: {
        ...(deviceConstraint(cfg.micId) as object),
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  } catch (e) {
    abort(e, 'microphone');
  }

  if (needsCamera(cfg.source)) {
    try {
      camera = await navigator.mediaDevices.getUserMedia({
        video: {
          ...(deviceConstraint(cfg.cameraId) as object),
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
    } catch (e) {
      if (cfg.source === 'camera') abort(e, 'camera');
      toast.warning('Camera unavailable', {
        description: 'Recording continues without the webcam bubble.',
      });
    }
  }

  return { display, mic: mic as MediaStream, camera };
}
