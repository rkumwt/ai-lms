import type { FieldPath, UseFormReturn } from 'react-hook-form';

import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import type { SettingsFormValues } from './settingsSchema';

interface ChoiceFieldProps {
  form: UseFormReturn<SettingsFormValues>;
  name: FieldPath<SettingsFormValues>;
  label: string;
  options: { value: string; label: string }[];
}

/** Segmented single-choice control bound to a settings field. */
export function ChoiceField({ form, name, label, options }: ChoiceFieldProps) {
  const labelId = `${name.replace('.', '-')}-label`;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel id={labelId}>{label}</FormLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={String(field.value)}
            onValueChange={(v) => v && field.onChange(v)}
            aria-labelledby={labelId}
            className="flex-wrap justify-start"
          >
            {options.map((o) => (
              <ToggleGroupItem key={o.value} value={o.value} className="px-4">
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FormItem>
      )}
    />
  );
}
