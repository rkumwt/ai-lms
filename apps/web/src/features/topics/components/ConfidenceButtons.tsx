import { CalendarClock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatReviewDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Confidence, Topic } from '@/types';

import { useSetConfidence } from '../hooks/useTopics';

const OPTIONS: { value: Confidence; label: string; days: number; className: string }[] = [
  {
    value: 'weak',
    label: 'Weak',
    days: 1,
    className:
      'data-[active=true]:border-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive',
  },
  {
    value: 'okay',
    label: 'Okay',
    days: 3,
    className:
      'data-[active=true]:border-warning data-[active=true]:bg-warning/15 data-[active=true]:text-amber-700 dark:data-[active=true]:text-warning',
  },
  {
    value: 'strong',
    label: 'Strong',
    days: 7,
    className:
      'data-[active=true]:border-success data-[active=true]:bg-success/10 data-[active=true]:text-success',
  },
];

export function ConfidenceButtons({ topic }: { topic: Topic }) {
  const setConfidence = useSetConfidence(topic.id);
  const current = setConfidence.variables ?? topic.confidence;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium" id={`confidence-${topic.id}`}>
        How well can you explain this?
      </p>
      <div
        className="grid grid-cols-3 gap-2"
        role="group"
        aria-labelledby={`confidence-${topic.id}`}
      >
        {OPTIONS.map((o) => (
          <Button
            key={o.value}
            variant="outline"
            data-active={current === o.value}
            aria-pressed={current === o.value}
            disabled={setConfidence.isPending}
            className={cn('flex h-auto flex-col gap-0.5 py-2', o.className)}
            onClick={() =>
              setConfidence.mutate(o.value, {
                onSuccess: () =>
                  toast.success(`Marked as ${o.label.toLowerCase()}`, {
                    description: `Next review in ${o.days} day${o.days === 1 ? '' : 's'}.`,
                  }),
                onError: (e) =>
                  toast.error('Could not update confidence', { description: e.message }),
              })
            }
          >
            <span className="font-semibold">{o.label}</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              review in {o.days}d
            </span>
          </Button>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
        <CalendarClock className="size-4" aria-hidden />
        Next review:{' '}
        <strong className="text-foreground">{formatReviewDate(topic.nextReviewAt)}</strong>
      </p>
    </div>
  );
}
