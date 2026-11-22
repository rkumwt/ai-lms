import type { RecordingQuality } from '@/types';

import type { MediaErrorInfo } from '../types';

export const support = {
  get media() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  },
  get display() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getDisplayMedia);
  },
  get recorder() {
    return typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
  },
};

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4;codecs=avc1,mp4a',
  'video/mp4',
];

export function pickMimeType(): string {
  return MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

export const QUALITY: Record<RecordingQuality, { width: number; height: number; bitrate: number }> =
  {
    '720p': { width: 1280, height: 720, bitrate: 2_500_000 },
    '1080p': { width: 1920, height: 1080, bitrate: 5_000_000 },
  };

export function stopStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((t) => t.stop());
}

export function deviceConstraint(deviceId: string | null): MediaTrackConstraints | boolean {
  return deviceId ? { deviceId: { exact: deviceId } } : true;
}

/** Maps getUserMedia/getDisplayMedia errors to friendly, actionable messages. */
export function describeMediaError(
  error: unknown,
  what: 'screen' | 'camera' | 'microphone' | 'devices',
): MediaErrorInfo {
  const name = error instanceof DOMException || error instanceof Error ? error.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return what === 'screen'
        ? {
            kind: 'cancelled',
            title: 'Screen sharing was cancelled',
            message:
              'Choose a screen, window or tab to share, or check that screen recording is allowed for your browser in system settings.',
          }
        : {
            kind: 'permission',
            title: `${what === 'devices' ? 'Camera or microphone' : what[0]?.toUpperCase() + what.slice(1)} access was blocked`,
            message: 'Allow access using the camera icon in the address bar, then try again.',
          };
    case 'NotFoundError':
    case 'OverconstrainedError':
      return {
        kind: 'no-device',
        title: `No ${what === 'devices' ? 'camera or microphone' : what} found`,
        message: 'Connect a device or pick a different one in the recording setup.',
      };
    case 'NotReadableError':
    case 'AbortError':
      return {
        kind: 'busy',
        title: 'Device is busy',
        message: 'Another app may be using your camera or microphone. Close it and try again.',
      };
    case 'NotSupportedError':
      return {
        kind: 'unsupported',
        title: 'Not supported',
        message:
          'This browser cannot record this source. Try the latest Chrome, Edge or Firefox on desktop.',
      };
    default:
      return {
        kind: 'unknown',
        title: 'Something went wrong',
        message: error instanceof Error ? error.message : 'Could not start the recording.',
      };
  }
}
