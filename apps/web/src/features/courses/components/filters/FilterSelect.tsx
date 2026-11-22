import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { ALL } from '../../constants';

interface FilterSelectProps<T extends string> {
  id: string;
  label: string;
  allLabel?: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (value: T | undefined) => void;
  stacked?: boolean;
  className?: string;
}

/** Select with an "All" option, rendered with a visible label when stacked (mobile sheet). */
export function FilterSelect<T extends string>({
  id,
  label,
  allLabel,
  value,
  options,
  onChange,
  stacked,
  className,
}: FilterSelectProps<T>) {
  return (
    <div className={cn(stacked && 'space-y-2', className)}>
      {stacked && <Label htmlFor={id}>{label}</Label>}
      <Select
        value={value ?? ALL}
        onValueChange={(v) =>
          onChange(v === ALL ? undefined : options.find((o) => o.value === v)?.value)
        }
      >
        <SelectTrigger
          id={id}
          aria-label={stacked ? undefined : label}
          className={cn(!stacked && 'w-[160px]')}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
