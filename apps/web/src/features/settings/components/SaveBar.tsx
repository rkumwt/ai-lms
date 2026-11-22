import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  onReset: () => void;
}

/** Sticky footer with unsaved-state text, Reset and Save (submit). */
export function SaveBar({ dirty, saving, onReset }: SaveBarProps) {
  return (
    <div className="sticky bottom-4 z-10 flex justify-end">
      <div className="flex items-center gap-3 rounded-xl border bg-background/95 p-2 pl-4 shadow-soft-lg backdrop-blur">
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
        <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" disabled={!dirty || saving}>
          {saving ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Save
        </Button>
      </div>
    </div>
  );
}
