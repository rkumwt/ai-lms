import { Textarea } from '@/components/ui/textarea';
import { formatTimestamp } from '@/lib/format';
import type { TranscriptLine } from '@/types';

interface TranscriptEditorProps {
  value: TranscriptLine[];
  onChange: (lines: TranscriptLine[]) => void;
}

export function TranscriptEditor({ value, onChange }: TranscriptEditorProps) {
  return (
    <ol className="space-y-2">
      {value.map((line, i) => (
        <li key={line.id} className="flex gap-3">
          <span className="mt-2 w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
            {formatTimestamp(line.startSec)}
          </span>
          <Textarea
            value={line.text}
            rows={2}
            onChange={(e) =>
              onChange(value.map((l, j) => (j === i ? { ...l, text: e.target.value } : l)))
            }
            aria-label={`Transcript at ${formatTimestamp(line.startSec)}`}
            className="min-h-0 resize-y text-sm"
          />
        </li>
      ))}
    </ol>
  );
}
