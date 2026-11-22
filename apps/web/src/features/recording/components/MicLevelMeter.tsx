import { cn } from '@/lib/utils';

import { useAudioLevel } from '../hooks/useAudioLevel';

const BARS = 12;

export function MicLevelMeter({
  stream,
  className,
}: {
  stream: MediaStream | null;
  className?: string;
}) {
  const level = useAudioLevel(stream);
  const lit = Math.round(level * BARS);
  return (
    <div
      className={cn('flex h-4 items-end gap-0.5', className)}
      role="meter"
      aria-label="Microphone level"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(level * 100)}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <span
          key={i}
          className={cn(
            'w-1.5 rounded-sm bg-muted transition-colors duration-75',
            i < lit &&
              (i < BARS * 0.6 ? 'bg-success' : i < BARS * 0.85 ? 'bg-warning' : 'bg-destructive'),
          )}
          style={{ height: `${30 + (i / BARS) * 70}%` }}
        />
      ))}
    </div>
  );
}
