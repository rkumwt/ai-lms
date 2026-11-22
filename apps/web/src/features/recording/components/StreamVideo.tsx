import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface StreamVideoProps {
  stream: MediaStream | null;
  mirrored?: boolean;
  className?: string;
  label: string;
}

/** Muted, autoplaying <video> bound to a MediaStream. */
export function StreamVideo({ stream, mirrored, className, label }: StreamVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.srcObject = stream;
    if (stream) void video.play().catch(() => undefined);
  }, [stream]);
  return (
    <video
      ref={ref}
      muted
      playsInline
      autoPlay
      aria-label={label}
      className={cn('bg-black object-cover', mirrored && '-scale-x-100', className)}
    />
  );
}
