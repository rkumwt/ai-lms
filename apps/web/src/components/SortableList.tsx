import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  /** Human-readable name used in screen reader announcements. */
  getLabel: (item: T) => string;
  children: ReactNode;
}

/** Vertical drag-and-drop list (pointer + keyboard: focus handle, Space, arrows, Space). */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  getLabel,
  children,
}: SortableListProps<T>) {
  const positionOf = (id: UniqueIdentifier) => items.findIndex((i) => i.id === id) + 1;
  const nameOf = (id: UniqueIdentifier) => {
    const item = items.find((i) => i.id === id);
    return item ? `“${getLabel(item)}”` : 'Item';
  };
  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${nameOf(active.id)}, position ${positionOf(active.id)} of ${items.length}.`,
    onDragOver: ({ active, over }) =>
      over ? `${nameOf(active.id)} moved to position ${positionOf(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over ? `Dropped ${nameOf(active.id)} at position ${positionOf(over.id)}.` : 'Dropped.',
    onDragCancel: ({ active }) => `Reordering cancelled. ${nameOf(active.id)} was not moved.`,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from >= 0 && to >= 0) onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'To reorder, press Space to pick up, use the arrow keys to move, then Space to drop or Escape to cancel.',
        },
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
