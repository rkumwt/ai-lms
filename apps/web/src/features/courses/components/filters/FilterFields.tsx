import { Label } from '@/components/ui/label';
import type { CourseFilters } from '@/types';

import { REVISION_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { useCategories } from '../../hooks/useCourses';

import { DateRangeFilter } from './DateRangeFilter';
import { FilterSelect } from './FilterSelect';
import { TagMultiSelect } from './TagMultiSelect';

interface FilterFieldsProps {
  filters: CourseFilters;
  update: (patch: Partial<CourseFilters>) => void;
  /** Stacked layout with visible labels (mobile bottom sheet). */
  stacked?: boolean;
}

export function FilterFields({ filters, update, stacked = false }: FilterFieldsProps) {
  const { data: categories = [] } = useCategories();
  const prefix = stacked ? 'm-' : '';
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <>
      <FilterSelect
        id={`${prefix}filter-category`}
        label="Category"
        allLabel="All categories"
        value={filters.category}
        options={categoryOptions}
        onChange={(category) => update({ category })}
        stacked={stacked}
      />
      <div className={stacked ? 'space-y-2' : undefined}>
        {stacked && <Label>Tags</Label>}
        <TagMultiSelect
          value={filters.tags ?? []}
          onChange={(tags) => update({ tags: tags.length ? tags : undefined })}
          className={stacked ? 'w-full' : 'w-[130px]'}
        />
      </div>
      <FilterSelect
        id={`${prefix}filter-status`}
        label="Status"
        allLabel="Any status"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(status) => update({ status })}
        stacked={stacked}
      />
      <FilterSelect
        id={`${prefix}filter-revision`}
        label="Revision"
        allLabel="Any revision"
        value={filters.revision}
        options={REVISION_OPTIONS}
        onChange={(revision) => update({ revision })}
        stacked={stacked}
      />
      <div className={stacked ? 'space-y-2' : undefined}>
        {stacked && <Label>Last updated</Label>}
        <DateRangeFilter
          from={filters.from}
          to={filters.to}
          onChange={({ from, to }) => update({ from, to })}
          className={stacked ? 'w-full' : undefined}
        />
      </div>
      <FilterSelect
        id={`${prefix}filter-sort`}
        label="Sort by"
        value={filters.sort ?? 'updated'}
        options={SORT_OPTIONS}
        onChange={(sort) => update({ sort: sort ?? 'updated' })}
        stacked={stacked}
      />
    </>
  );
}
