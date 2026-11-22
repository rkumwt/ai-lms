import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { CourseFilters } from '@/types';

import { FilterFields } from './FilterFields';
import { SearchInput } from './SearchInput';

interface CourseFilterBarProps {
  filters: CourseFilters;
  update: (patch: Partial<CourseFilters>) => void;
  clear: () => void;
  activeCount: number;
  resultCount?: number;
}

export function CourseFilterBar({
  filters,
  update,
  clear,
  activeCount,
  resultCount,
}: CourseFilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetCount = activeCount - (filters.q ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="flex gap-2 lg:contents">
        <SearchInput
          value={filters.q}
          onChange={(q) => update({ q })}
          placeholder="Search courses"
          className="flex-1 lg:w-64 lg:flex-none"
        />
        <Button variant="outline" className="lg:hidden" onClick={() => setSheetOpen(true)}>
          <SlidersHorizontal aria-hidden />
          Filters
          {sheetCount > 0 && <Badge variant="info">{sheetCount}</Badge>}
        </Button>
      </div>

      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <FilterFields filters={filters} update={update} />
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-xl">
          <SheetHeader className="text-left">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down your courses.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <FilterFields filters={filters} update={update} stacked />
          </div>
          <SheetFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clear}
              disabled={activeCount === 0}
            >
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              Show {resultCount ?? ''} results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
