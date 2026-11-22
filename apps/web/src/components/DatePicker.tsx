import { format, parseISO } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  id?: string;
  /** yyyy-MM-dd */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disablePast?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  disablePast,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const date = value ? parseISO(value) : undefined;

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn('flex-1 justify-start font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarDays aria-hidden />
            {date ? format(date, 'd MMMM yyyy') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              onChange(d ? format(d, 'yyyy-MM-dd') : null);
              setOpen(false);
            }}
            disabled={disablePast ? { before: new Date() } : undefined}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(null)}
          aria-label="Clear date"
        >
          <X aria-hidden />
        </Button>
      )}
    </div>
  );
}
