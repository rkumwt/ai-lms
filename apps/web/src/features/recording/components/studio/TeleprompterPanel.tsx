import { Minus, Pause, Play, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { NotesContent } from '@/components/NotesContent';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TeleprompterPanelProps {
  topicId: string;
  notesHtml: string;
  onClose: () => void;
}

const FONT_SIZES = [14, 16, 18, 22, 26, 32];

/** Collapsible notes panel with adjustable font size and optional auto-scroll. */
export function TeleprompterPanel({ topicId, notesHtml, onClose }: TeleprompterPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fontIndex, setFontIndex] = useState(2);
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(30);

  useEffect(() => {
    if (!scrolling) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const el = scrollRef.current;
      if (el) el.scrollTop += ((now - last) / 1000) * speed;
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scrolling, speed]);

  const empty = !notesHtml.replace(/<[^>]+>/g, '').trim();

  return (
    <aside
      aria-label="Teleprompter"
      className="flex w-full flex-col border-l bg-card sm:w-80 lg:w-96"
    >
      <div className="flex items-center gap-1 border-b px-3 py-2">
        <h2 className="flex-1 text-sm font-semibold">Notes</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setFontIndex((i) => Math.max(0, i - 1))}
          aria-label="Smaller text"
        >
          <Minus aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setFontIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
          aria-label="Larger text"
        >
          <Plus aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onClose}
          aria-label="Close notes"
        >
          <X aria-hidden />
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4"
        style={{ fontSize: FONT_SIZES[fontIndex] }}
      >
        {empty ? (
          <p className="text-sm text-muted-foreground">
            No notes yet.{' '}
            <Link to={`/topics/${topicId}/edit`} className="font-medium text-primary underline">
              Add notes
            </Link>{' '}
            to use them as a teleprompter.
          </p>
        ) : (
          <NotesContent
            html={notesHtml}
            className="text-[1em] [&_*]:text-[inherit] [&_h2]:text-[1.25em] [&_h3]:text-[1.1em]"
          />
        )}
      </div>
      {!empty && (
        <div className="flex items-center gap-3 border-t px-3 py-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => setScrolling((s) => !s)}
            aria-label={scrolling ? 'Pause auto-scroll' : 'Start auto-scroll'}
          >
            {scrolling ? <Pause aria-hidden /> : <Play aria-hidden />}
          </Button>
          <Slider
            value={[speed]}
            min={10}
            max={120}
            step={5}
            onValueChange={([v]) => setSpeed(v ?? speed)}
            aria-label="Scroll speed"
          />
        </div>
      )}
    </aside>
  );
}
