import { format, parseISO } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { formatRangeLabel } from '../../utils';

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
  className?: string;
}

const toIso = (d: Date | undefined) => (d ? format(d, 'yyyy-MM-dd') : undefined);

export function DateRangeFilter({ from, to, onChange, className }: DateRangeFilterProps) {
  const selected: DateRange | undefined = from
    ? { from: parseISO(from), to: to ? parseISO(to) : undefined }
    : undefined;
  const active = Boolean(from || to);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('justify-start font-normal', !active && 'text-muted-foreground', className)}
          aria-label={`Filter by last updated date: ${formatRangeLabel(from, to)}`}
        >
          <CalendarDays aria-hidden />
          {formatRangeLabel(from, to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={selected}
          onSelect={(range) => onChange({ from: toIso(range?.from), to: toIso(range?.to) })}
          disabled={{ after: new Date() }}
        />
        {active && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange({})}>
              <X aria-hidden /> Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
