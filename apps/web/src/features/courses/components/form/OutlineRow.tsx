import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

import { DragHandle } from '@/components/DragHandle';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import type { OutlineItem } from './courseSchema';

interface OutlineRowProps {
  item: OutlineItem;
  index: number;
  onChange: (item: OutlineItem) => void;
  onRemove: () => void;
}

export function OutlineRow({ item, index, onChange, onRemove }: OutlineRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-1.5 rounded-md border bg-card py-1 pl-1 pr-1.5',
        isDragging && 'relative z-10 shadow-soft-lg',
        !item.checked && 'opacity-60',
      )}
    >
      <DragHandle
        label={`Reorder topic ${index + 1}`}
        attributes={attributes}
        listeners={listeners}
      />
      <Checkbox
        checked={item.checked}
        onCheckedChange={(v) => onChange({ ...item, checked: v === true })}
        aria-label={`Include “${item.title}”`}
      />
      <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">
        {index + 1}.
      </span>
      <input
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        className="min-w-0 flex-1 rounded bg-transparent px-1 py-1 text-sm outline-none focus:bg-muted/60"
        aria-label={`Topic ${index + 1} title`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`Remove “${item.title}”`}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </li>
  );
}
