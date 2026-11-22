import { format, parseISO } from 'date-fns';

export function formatRangeLabel(from?: string, to?: string): string {
  if (from && to) return `${format(parseISO(from), 'd MMM')} – ${format(parseISO(to), 'd MMM')}`;
  if (from) return `From ${format(parseISO(from), 'd MMM')}`;
  if (to) return `Until ${format(parseISO(to), 'd MMM')}`;
  return 'Updated any time';
}
