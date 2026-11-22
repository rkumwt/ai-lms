import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { cn } from '@/lib/utils';

export interface VideoPlayerHandle {
  seek: (seconds: number, play?: boolean) => void;
}

interface VideoPlayerProps {
  src: string;
  title: string;
  initialTime?: number;
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

/**
 * Native video with an imperative seek handle. Also fixes MediaRecorder WebM blobs,
 * which report duration = Infinity until the browser is forced to scan to the end.
 */
export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer(
  { src, title, initialTime, onTimeUpdate, className },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(initialTime ?? null);
  const fixingDuration = useRef(false);

  useImperativeHandle(ref, () => ({
    seek(seconds, play = true) {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = seconds;
      if (play) void video.play().catch(() => undefined);
    },
  }));

  useEffect(() => {
    pendingSeek.current = initialTime ?? null;
  }, [src, initialTime]);

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration === Infinity) {
      fixingDuration.current = true;
      video.currentTime = Number.MAX_SAFE_INTEGER;
      return;
    }
    if (pendingSeek.current !== null) {
      video.currentTime = pendingSeek.current;
      pendingSeek.current = null;
    }
  };

  const onTime = () => {
    const video = videoRef.current;
    if (!video) return;
    if (fixingDuration.current) {
      fixingDuration.current = false;
      video.currentTime = pendingSeek.current ?? 0;
      pendingSeek.current = null;
      return;
    }
    onTimeUpdate?.(video.currentTime);
  };

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      playsInline
      preload="metadata"
      aria-label={title}
      onLoadedMetadata={onLoadedMetadata}
      onTimeUpdate={onTime}
      onSeeked={onTime}
      className={cn('aspect-video w-full rounded-xl bg-black shadow-soft', className)}
    >
      <track kind="captions" />
    </video>
  );
});
