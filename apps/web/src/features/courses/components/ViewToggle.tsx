import { LayoutGrid, List } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePreferencesStore, type CourseView } from '@/stores/preferencesStore';

export function ViewToggle() {
  const view = usePreferencesStore((s) => s.courseView);
  const setView = usePreferencesStore((s) => s.setCourseView);
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={view}
      onValueChange={(v) => v && setView(v as CourseView)}
      aria-label="Course layout"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="size-4" aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="size-4" aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
