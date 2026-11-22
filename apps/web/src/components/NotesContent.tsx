import { useMemo } from 'react';

import { sanitizeHtml } from '@/lib/sanitize';
import { cn } from '@/lib/utils';

/** Renders user notes HTML after allowlist sanitizing. */
export function NotesContent({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(() => sanitizeHtml(html), [html]);
  return (
    <div className={cn('notes-content', className)} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
