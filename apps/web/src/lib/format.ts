import { differenceInCalendarDays, format, formatDistanceToNowStrict } from 'date-fns';

/** 125 -> "2:05", 3725 -> "1:02:05" */
export function formatTimestamp(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

/** 4210 -> "1h 10m", 412 -> "7m", 0 -> "0m" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function formatDate(iso: string, pattern = 'd MMM yyyy'): string {
  return format(new Date(iso), pattern);
}

/** "Today", "Tomorrow", "In 3 days", "2 days overdue" */
export function formatReviewDate(iso: string | null): string {
  if (!iso) return 'Not scheduled';
  const diff = differenceInCalendarDays(new Date(iso), new Date());
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1) return `In ${diff} days`;
  return `${Math.abs(diff)} day${diff === -1 ? '' : 's'} overdue`;
}

export function pluralize(count: number, word: string, plural = `${word}s`): string {
  return `${count} ${count === 1 ? word : plural}`;
}
