import { useEffect, useState } from 'react';

import { describeMediaError, stopStream, support } from '../lib/media';
import type { MediaErrorInfo } from '../types';

interface PreviewOptions {
  enabled: boolean;
  micId: string | null;
  cameraId: string | null;
  withCamera: boolean;
  onGranted?: () => void;
}

/** Live mic (+ optional camera) stream for the setup dialog; stopped whenever inputs change. */
export function usePreviewStream({
  enabled,
  micId,
  cameraId,
  withCamera,
  onGranted,
}: PreviewOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<MediaErrorInfo | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !support.media) return;
    let active = true;
    let acquired: MediaStream | null = null;
    setError(null);
    navigator.mediaDevices
      .getUserMedia({
        audio: micId ? { deviceId: { exact: micId } } : true,
        video: withCamera
          ? { ...(cameraId ? { deviceId: { exact: cameraId } } : {}), width: { ideal: 640 } }
          : false,
      })
      .then((s) => {
        if (!active) return stopStream(s);
        acquired = s;
        setStream(s);
        onGranted?.();
      })
      .catch((e: unknown) => {
        if (!active) return;
        setStream(null);
        setError(describeMediaError(e, withCamera ? 'devices' : 'microphone'));
      });
    return () => {
      active = false;
      stopStream(acquired);
      setStream(null);
    };
    // onGranted is a fire-and-forget callback; re-running on its identity would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, micId, cameraId, withCamera, attempt]);

  return { stream, error, retry: () => setAttempt((n) => n + 1) };
}
