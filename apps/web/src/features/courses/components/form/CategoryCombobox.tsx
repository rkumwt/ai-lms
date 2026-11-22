import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

import { useCategories, useCreateCategory } from '../../hooks/useCourses';

interface CategoryComboboxProps {
  id?: string;
  value: string;
  onChange: (categoryId: string) => void;
  invalid?: boolean;
}

/** Category picker that can create a new category inline. */
export function CategoryCombobox({ id, value, onChange, invalid }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: categories = [] } = useCategories();
  const create = useCreateCategory();
  const selected = categories.find((c) => c.id === value);
  const trimmed = search.trim();
  const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());

  const select = (categoryId: string) => {
    onChange(categoryId);
    setOpen(false);
    setSearch('');
  };

  const onCreate = () =>
    create.mutate(trimmed, {
      onSuccess: (category) => {
        select(category.id);
        toast.success(`Category “${category.name}” created`);
      },
      onError: (e) => toast.error('Could not create category', { description: e.message }),
    });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            'w-full justify-between font-normal',
            !selected && 'text-muted-foreground',
            invalid && 'border-destructive',
          )}
        >
          {selected?.name ?? 'Choose a category'}
          <ChevronsUpDown className="opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search or create…" value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty className="p-1">
              {trimmed ? null : <p className="py-4 text-center text-sm">No categories.</p>}
            </CommandEmpty>
            <CommandGroup>
              {categories.map((c) => (
                <CommandItem key={c.id} value={c.name} onSelect={() => select(c.id)}>
                  <Check className={cn(c.id === value ? 'opacity-100' : 'opacity-0')} aria-hidden />
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {trimmed && !exists && (
              <CommandGroup forceMount>
                <CommandItem
                  forceMount
                  value={`__create__${trimmed}`}
                  onSelect={onCreate}
                  disabled={create.isPending}
                >
                  {create.isPending ? (
                    <Loader2 className="animate-spin" aria-hidden />
                  ) : (
                    <Plus aria-hidden />
                  )}
                  Create “{trimmed}”
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
