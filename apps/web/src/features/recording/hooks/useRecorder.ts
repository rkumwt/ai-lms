import { useCallback, useEffect, useRef, useState } from 'react';

import { createCompositor } from '../lib/compositor';
import { MediaAcquireError, acquireStreams } from '../lib/acquireStreams';
import { QUALITY, describeMediaError, pickMimeType, stopStream, support } from '../lib/media';
import {
  type BubbleState,
  type MediaErrorInfo,
  type RecorderStatus,
  type RecordingConfig,
  type RecordingResult,
} from '../types';

interface UseRecorderOptions {
  config: RecordingConfig;
  getBubble: () => BubbleState;
  onFinished: (result: RecordingResult) => void;
}

interface Session {
  display: MediaStream | null;
  camera: MediaStream | null;
  mic: MediaStream | null;
  compositor: ReturnType<typeof createCompositor> | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  accumulatedMs: number;
  segmentStart: number | null;
  countdownTimer: number | null;
  camOn: boolean;
}

const emptySession = (): Session => ({
  display: null,
  camera: null,
  mic: null,
  compositor: null,
  recorder: null,
  chunks: [],
  accumulatedMs: 0,
  segmentStart: null,
  countdownTimer: null,
  camOn: true,
});

const UNSUPPORTED: MediaErrorInfo = {
  kind: 'unsupported',
  title: 'Recording is not supported here',
  message:
    'Your browser cannot record media. Use the latest Chrome, Edge or Firefox on a desktop computer.',
};

/** Owns the full recording lifecycle: permissions → countdown → MediaRecorder → local Blob. */
export function useRecorder({ config, getBubble, onFinished }: UseRecorderOptions) {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<MediaErrorInfo | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const session = useRef<Session>(emptySession());
  const latest = useRef({ getBubble, onFinished, config });
  latest.current = { getBubble, onFinished, config };

  const release = useCallback(() => {
    const s = session.current;
    if (s.countdownTimer) window.clearInterval(s.countdownTimer);
    s.compositor?.stop();
    [s.display, s.camera, s.mic].forEach(stopStream);
    session.current = emptySession();
    setDisplayStream(null);
    setCameraStream(null);
  }, []);

  const begin = useCallback(() => {
    const s = session.current;
    const { config: cfg } = latest.current;
    let video: MediaStreamTrack[] = [];
    if (cfg.source === 'camera') video = s.camera?.getVideoTracks() ?? [];
    else if (s.compositor) video = s.compositor.stream.getVideoTracks();
    else video = s.display?.getVideoTracks() ?? [];

    const stream = new MediaStream([...video, ...(s.mic?.getAudioTracks() ?? [])]);
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, {
      mimeType: mimeType || undefined,
      videoBitsPerSecond: QUALITY[cfg.quality].bitrate,
    });
    recorder.ondataavailable = (e) => e.data.size > 0 && s.chunks.push(e.data);
    recorder.onstop = () => {
      const type = recorder.mimeType || mimeType || 'video/webm';
      const blob = new Blob(s.chunks, { type });
      const durationSec = Math.max(1, Math.round(s.accumulatedMs / 1000));
      release();
      setStatus('idle');
      latest.current.onFinished({
        topicId: cfg.topicId,
        blobUrl: URL.createObjectURL(blob),
        mimeType: type,
        sizeBytes: blob.size,
        durationSec,
        createdAt: new Date().toISOString(),
        uploaded: false,
      });
    };
    s.recorder = recorder;
    recorder.start(1000);
    s.segmentStart = performance.now();
    setElapsedMs(0);
    setStatus('recording');
  }, [release]);

  const stop = useCallback(() => {
    const s = session.current;
    if (s.countdownTimer) {
      release();
      setStatus('idle');
      return;
    }
    if (!s.recorder || s.recorder.state === 'inactive') return;
    if (s.segmentStart !== null) s.accumulatedMs += performance.now() - s.segmentStart;
    s.segmentStart = null;
    setStatus('stopping');
    s.recorder.stop();
  }, [release]);

  const stopRef = useRef(stop);
  stopRef.current = stop;

  const start = useCallback(async () => {
    if (!support.media || !support.recorder) {
      setError(UNSUPPORTED);
      setStatus('error');
      return;
    }
    const cfg = latest.current.config;
    const s = session.current;
    setError(null);
    setStatus('acquiring');
    try {
      Object.assign(s, await acquireStreams(cfg, () => stopRef.current()));
    } catch (e) {
      release();
      setError(e instanceof MediaAcquireError ? e.info : describeMediaError(e, 'devices'));
      setStatus('error');
      return;
    }

    s.mic?.getAudioTracks().forEach((t) => (t.enabled = micOn));
    s.camera?.getVideoTracks().forEach((t) => (t.enabled = camOn));
    s.camOn = camOn;
    if (cfg.source === 'screen_camera' && s.display) {
      s.compositor = createCompositor({
        display: s.display,
        camera: s.camera,
        getBubble: () => ({ ...latest.current.getBubble(), visible: session.current.camOn }),
      });
    }
    setDisplayStream(s.display);
    setCameraStream(s.camera);

    if (!cfg.countdown) return begin();
    let n = 3;
    setCountdown(n);
    setStatus('countdown');
    s.countdownTimer = window.setInterval(() => {
      n -= 1;
      if (n > 0) return setCountdown(n);
      if (s.countdownTimer) window.clearInterval(s.countdownTimer);
      s.countdownTimer = null;
      begin();
    }, 1000);
  }, [begin, release, micOn, camOn]);

  const pause = useCallback(() => {
    const s = session.current;
    if (s.recorder?.state !== 'recording' || s.segmentStart === null) return;
    s.recorder.pause();
    s.accumulatedMs += performance.now() - s.segmentStart;
    s.segmentStart = null;
    setElapsedMs(s.accumulatedMs);
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    const s = session.current;
    if (s.recorder?.state !== 'paused') return;
    s.recorder.resume();
    s.segmentStart = performance.now();
    setStatus('recording');
  }, []);

  const toggleMic = useCallback(() => {
    setMicOn((on) => {
      session.current.mic?.getAudioTracks().forEach((t) => (t.enabled = !on));
      return !on;
    });
  }, []);

  const toggleCam = useCallback(() => {
    setCamOn((on) => {
      session.current.camera?.getVideoTracks().forEach((t) => (t.enabled = !on));
      session.current.camOn = !on;
      return !on;
    });
  }, []);

  // Tick the visible timer while recording.
  useEffect(() => {
    if (status !== 'recording') return;
    const id = window.setInterval(() => {
      const s = session.current;
      setElapsedMs(s.accumulatedMs + (s.segmentStart ? performance.now() - s.segmentStart : 0));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  // Leaving the page discards an unfinished recording and releases devices.
  useEffect(
    () => () => {
      const recorder = session.current.recorder;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.stop();
      }
      release();
    },
    [release],
  );

  return {
    status,
    error,
    countdown,
    elapsedMs,
    micOn,
    camOn,
    displayStream,
    cameraStream,
    start,
    stop,
    pause,
    resume,
    toggleMic,
    toggleCam,
    dismissError: () => {
      setError(null);
      setStatus('idle');
    },
  };
}
