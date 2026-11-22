import { Check, ChevronsUpDown, Tags } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useTags } from '../../hooks/useCourses';

interface TagMultiSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagMultiSelect({ value, onChange, className }: TagMultiSelectProps) {
  const { data: tags = [], isPending } = useTags();

  const toggle = (tag: string) =>
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('justify-between font-normal', className)}
          aria-label="Filter by tags"
        >
          <span className="flex items-center gap-2">
            <Tags className="text-muted-foreground" aria-hidden />
            Tags
            {value.length > 0 && <Badge variant="info">{value.length}</Badge>}
          </span>
          <ChevronsUpDown className="opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tags…" />
          <CommandList>
            <CommandEmpty>{isPending ? 'Loading tags…' : 'No tags found.'}</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => {
                const selected = value.includes(tag);
                return (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => toggle(tag)}
                    aria-selected={selected}
                  >
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        selected ? 'bg-primary text-primary-foreground' : 'opacity-50',
                      )}
                    >
                      {selected && <Check className="size-3" aria-hidden />}
                    </span>
                    #{tag}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {value.length > 0 && (
          <div className="border-t p-1">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange([])}>
              Clear tags
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
