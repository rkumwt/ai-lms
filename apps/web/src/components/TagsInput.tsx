import { X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

interface TagsInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  max?: number;
  placeholder?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
}

const normalize = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

/** Chip input: Enter or comma adds a tag, Backspace on empty removes the last one. */
export function TagsInput({
  id,
  value,
  onChange,
  suggestions = [],
  max = 10,
  placeholder = 'Add a tag and press Enter',
  invalid,
  ...aria
}: TagsInputProps) {
  const [text, setText] = useState('');
  const full = value.length >= max;

  const add = (raw: string) => {
    const tag = normalize(raw);
    if (tag && !value.includes(tag) && !full) onChange([...value, tag]);
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(text);
    } else if (e.key === 'Backspace' && !text && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const matches = text
    ? suggestions.filter((s) => s.includes(normalize(text)) && !value.includes(s)).slice(0, 6)
    : [];

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-ring',
          invalid && 'border-destructive',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-secondary py-0.5 pl-2 pr-1 text-xs"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            if (!raw.includes(',')) return setText(raw);
            // Handles typed or pasted comma-separated tags.
            const parts = raw.split(',');
            const rest = parts.pop() ?? '';
            const added = parts.map(normalize).filter((t) => t && !value.includes(t));
            if (added.length) onChange([...new Set([...value, ...added])].slice(0, max));
            setText(rest);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => text && add(text)}
          placeholder={full ? `Max ${max} tags` : placeholder}
          disabled={full}
          className="min-w-[8rem] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          aria-invalid={invalid}
          {...aria}
        />
      </div>
      {matches.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Suggested tags">
          {matches.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(s)}
              className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              + #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
