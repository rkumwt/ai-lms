import { cn } from '@/lib/utils';
import type { RecordingSource } from '@/types';

import { support } from '../../lib/media';
import { SOURCE_META } from '../../sources';
import { needsDisplay } from '../../types';

interface SourcePickerProps {
  value: RecordingSource;
  onChange: (source: RecordingSource) => void;
}

export function SourcePicker({ value, onChange }: SourcePickerProps) {
  const sources = Object.keys(SOURCE_META) as RecordingSource[];
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Source</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sources.map((source) => {
          const meta = SOURCE_META[source];
          const disabled = needsDisplay(source) && !support.display;
          const selected = value === source;
          return (
            <label
              key={source}
              className={cn(
                'relative flex cursor-pointer flex-col gap-2 rounded-lg border p-3 text-left transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-muted/50',
                selected && 'border-primary bg-primary/5 ring-1 ring-primary',
                disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
              )}
            >
              <input
                type="radio"
                name="recording-source"
                value={source}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(source)}
                aria-label={`${meta.label}: ${disabled ? 'not available in this browser' : meta.description}`}
                className="sr-only"
              />
              <meta.icon
                className={cn('size-5', selected ? 'text-primary' : 'text-muted-foreground')}
                aria-hidden
              />
              <span className="text-sm font-medium leading-tight">{meta.label}</span>
              <span className="text-xs text-muted-foreground">
                {disabled ? 'Not available in this browser' : meta.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
