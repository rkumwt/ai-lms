import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { CourseFilters, CourseSort, CourseStatus, RevisionFilter } from '@/types';

const STATUSES: CourseStatus[] = ['not_started', 'in_progress', 'completed'];
const REVISIONS: RevisionFilter[] = ['due', 'up_to_date'];
const SORTS: CourseSort[] = ['updated', 'progress', 'az'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pick<T extends string>(value: string | null, allowed: T[]): T | undefined {
  return allowed.find((v) => v === value);
}

function parse(params: URLSearchParams): CourseFilters {
  const date = (key: string) => {
    const v = params.get(key);
    return v && DATE_RE.test(v) ? v : undefined;
  };
  const tags = params.get('tags')?.split(',').filter(Boolean);
  return {
    q: params.get('q') ?? undefined,
    category: params.get('category') ?? undefined,
    tags: tags?.length ? tags : undefined,
    status: pick(params.get('status'), STATUSES),
    revision: pick(params.get('revision'), REVISIONS),
    from: date('from'),
    to: date('to'),
    sort: pick(params.get('sort'), SORTS) ?? 'updated',
  };
}

function serialize(filters: CourseFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.tags?.length) params.set('tags', filters.tags.join(','));
  if (filters.status) params.set('status', filters.status);
  if (filters.revision) params.set('revision', filters.revision);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.sort && filters.sort !== 'updated') params.set('sort', filters.sort);
  return params;
}

/** Course filters stored in the URL search params, so they survive reloads and can be shared. */
export function useCourseFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parse(params), [params]);

  const update = useCallback(
    (patch: Partial<CourseFilters>) =>
      setParams((prev) => serialize({ ...parse(prev), ...patch }), { replace: true }),
    [setParams],
  );

  const clear = useCallback(
    () => setParams((prev) => serialize({ sort: parse(prev).sort }), { replace: true }),
    [setParams],
  );

  const activeCount = [
    filters.q,
    filters.category,
    filters.tags?.length,
    filters.status,
    filters.revision,
    filters.from || filters.to,
  ].filter(Boolean).length;

  return { filters, update, clear, activeCount };
}
