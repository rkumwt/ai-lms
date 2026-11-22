import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DragHandleProps {
  label: string;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  className?: string;
}

export function DragHandle({ label, attributes, listeners, className }: DragHandleProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing',
        className,
      )}
      {...attributes}
      {...listeners}
      aria-label={label}
    >
      <GripVertical className="size-4" aria-hidden />
    </button>
  );
}
