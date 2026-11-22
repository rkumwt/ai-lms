import { useRef, type KeyboardEvent, type PointerEvent } from 'react';

import { cn } from '@/lib/utils';

import type { BubbleState } from '../../types';
import { StreamVideo } from '../StreamVideo';

interface WebcamBubbleProps {
  stream: MediaStream | null;
  value: BubbleState;
  onChange: (value: BubbleState) => void;
  hidden?: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const SIZES = [0.2, 0.28, 0.38];

/** Round, draggable camera overlay. Arrow keys move it, +/- resize it. */
export function WebcamBubble({ stream, value, onChange, hidden }: WebcamBubbleProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const toFraction = (clientX: number, clientY: number) => {
    const parent = ref.current?.parentElement?.getBoundingClientRect();
    if (!parent) return null;
    return {
      x: (clientX - parent.left) / parent.width,
      y: (clientY - parent.top) / parent.height,
      parent,
    };
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const pos = toFraction(e.clientX, e.clientY);
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: pos.x - value.x, dy: pos.y - value.y };
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const pos = drag.current && toFraction(e.clientX, e.clientY);
    if (!pos || !drag.current) return;
    const halfW = (value.size * pos.parent.height) / pos.parent.width / 2;
    onChange({
      ...value,
      x: clamp(pos.x - drag.current.dx, halfW, 1 - halfW),
      y: clamp(pos.y - drag.current.dy, value.size / 2, 1 - value.size / 2),
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = 0.02;
    const moves: Record<string, Partial<BubbleState>> = {
      ArrowLeft: { x: clamp(value.x - step, 0.05, 0.95) },
      ArrowRight: { x: clamp(value.x + step, 0.05, 0.95) },
      ArrowUp: { y: clamp(value.y - step, 0.1, 0.9) },
      ArrowDown: { y: clamp(value.y + step, 0.1, 0.9) },
    };
    const sizeIndex = SIZES.indexOf(value.size);
    if (e.key === '+' || e.key === '=')
      moves[e.key] = { size: SIZES[Math.min(SIZES.length - 1, sizeIndex + 1)] };
    if (e.key === '-') moves[e.key] = { size: SIZES[Math.max(0, sizeIndex - 1)] };
    const patch = moves[e.key];
    if (!patch) return;
    e.preventDefault();
    onChange({ ...value, ...patch });
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Webcam bubble. Drag or use arrow keys to move, plus and minus to resize."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (drag.current = null)}
      onKeyDown={onKeyDown}
      onDoubleClick={() =>
        onChange({ ...value, size: SIZES[(SIZES.indexOf(value.size) + 1) % SIZES.length] ?? 0.28 })
      }
      className={cn(
        'absolute z-20 aspect-square -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none overflow-hidden rounded-full border-4 border-white shadow-soft-lg active:cursor-grabbing',
        hidden && 'invisible',
      )}
      style={{
        left: `${value.x * 100}%`,
        top: `${value.y * 100}%`,
        height: `${value.size * 100}%`,
      }}
    >
      <StreamVideo
        stream={stream}
        mirrored
        label="Your camera"
        className="pointer-events-none size-full"
      />
    </button>
  );
}
