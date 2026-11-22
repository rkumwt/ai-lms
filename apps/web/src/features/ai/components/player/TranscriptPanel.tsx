import { useEffect, useMemo, useRef, useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { formatTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TranscriptLine } from '@/types';

interface TranscriptPanelProps {
  lines: TranscriptLine[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

export function TranscriptPanel({ lines, currentTime, onSeek, className }: TranscriptPanelProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [follow, setFollow] = useState(true);
  const activeIndex = useMemo(() => {
    let index = -1;
    lines.forEach((line, i) => {
      if (line.startSec <= currentTime) index = i;
    });
    return index;
  }, [lines, currentTime]);

  useEffect(() => {
    if (!follow || activeIndex < 0) return;
    const list = listRef.current;
    const item = list?.children[activeIndex] as HTMLElement | undefined;
    if (list && item)
      list.scrollTo({ top: item.offsetTop - list.clientHeight / 3, behavior: 'smooth' });
  }, [activeIndex, follow]);

  return (
    <div className={cn('flex min-h-0 flex-col rounded-xl border bg-card shadow-soft', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold">Transcript</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <label htmlFor="transcript-follow">Auto-scroll</label>
          <Switch
            id="transcript-follow"
            checked={follow}
            onCheckedChange={setFollow}
            className="scale-75"
          />
        </div>
      </div>
      <ol
        ref={listRef}
        className="scrollbar-thin relative min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2"
        aria-label="Transcript lines"
      >
        {lines.map((line, i) => (
          <li key={line.id}>
            <button
              type="button"
              onClick={() => onSeek(line.startSec)}
              aria-current={i === activeIndex ? 'true' : undefined}
              className={cn(
                'flex w-full gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted',
                i === activeIndex && 'bg-primary/10 text-foreground',
                i !== activeIndex && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'w-10 shrink-0 pt-px font-mono text-xs tabular-nums',
                  i === activeIndex && 'font-semibold text-primary',
                )}
              >
                {formatTimestamp(line.startSec)}
              </span>
              <span>{line.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
