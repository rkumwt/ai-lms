import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatTimestamp } from '@/lib/format';
import type { AskAiSource } from '@/types';

export function SourceCard({
  source,
  onNavigate,
}: {
  source: AskAiSource;
  onNavigate: () => void;
}) {
  const time = formatTimestamp(source.timestampSec);
  return (
    <div className="rounded-lg border bg-background p-3 text-left">
      <p className="truncate text-xs text-muted-foreground">{source.courseTitle}</p>
      <p className="truncate text-sm font-medium">{source.topicTitle}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">“{source.snippet}”</p>
      <Link
        to={`/topics/${source.topicId}?t=${Math.floor(source.timestampSec)}`}
        onClick={onNavigate}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <PlayCircle className="size-3.5" aria-hidden /> Jump to {time}
      </Link>
    </div>
  );
}
