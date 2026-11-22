import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CourseFilters } from '@/types';

import { REVISION_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { useCategories } from '../../hooks/useCourses';
import { formatRangeLabel } from '../../utils';

interface Chip {
  key: string;
  label: string;
  remove: () => void;
}

interface ActiveFilterChipsProps {
  filters: CourseFilters;
  update: (patch: Partial<CourseFilters>) => void;
  clear: () => void;
}

export function ActiveFilterChips({ filters, update, clear }: ActiveFilterChipsProps) {
  const { data: categories = [] } = useCategories();
  const chips: Chip[] = [];

  if (filters.q)
    chips.push({ key: 'q', label: `“${filters.q}”`, remove: () => update({ q: undefined }) });
  if (filters.category) {
    const name = categories.find((c) => c.id === filters.category)?.name ?? 'Category';
    chips.push({ key: 'category', label: name, remove: () => update({ category: undefined }) });
  }
  filters.tags?.forEach((tag) =>
    chips.push({
      key: `tag-${tag}`,
      label: `#${tag}`,
      remove: () => {
        const rest = filters.tags?.filter((t) => t !== tag) ?? [];
        update({ tags: rest.length ? rest : undefined });
      },
    }),
  );
  if (filters.status) {
    const label = STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status;
    chips.push({ key: 'status', label, remove: () => update({ status: undefined }) });
  }
  if (filters.revision) {
    const label =
      REVISION_OPTIONS.find((o) => o.value === filters.revision)?.label ?? filters.revision;
    chips.push({ key: 'revision', label, remove: () => update({ revision: undefined }) });
  }
  if (filters.from || filters.to) {
    chips.push({
      key: 'dates',
      label: formatRangeLabel(filters.from, filters.to),
      remove: () => update({ from: undefined, to: undefined }),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full border bg-secondary py-0.5 pl-3 pr-1 text-xs font-medium"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.remove}
            className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}
      <Button variant="link" size="sm" className="h-auto px-1 text-xs" onClick={clear}>
        Clear all
      </Button>
    </div>
  );
}
