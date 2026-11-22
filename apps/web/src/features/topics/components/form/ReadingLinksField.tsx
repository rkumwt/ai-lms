import { ExternalLink, Link2, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { TopicFormValues } from './topicSchema';

export function ReadingLinksField({ form }: { form: UseFormReturn<TopicFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'links',
    keyName: 'key',
  });

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Reading links</legend>
      {fields.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link2 className="size-4" aria-hidden /> Add docs, articles or videos you studied from.
        </p>
      )}
      <ul className="space-y-2">
        {fields.map((field, index) => (
          <li
            key={field.key}
            className="flex flex-col gap-2 rounded-md border p-2 sm:flex-row sm:items-start"
          >
            <FormField
              control={form.control}
              name={`links.${index}.title`}
              render={({ field: f }) => (
                <FormItem className="flex-1 space-y-1">
                  <FormControl>
                    <Input placeholder="Title" aria-label={`Link ${index + 1} title`} {...f} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`links.${index}.url`}
              render={({ field: f }) => (
                <FormItem className="flex-[1.4] space-y-1">
                  <FormControl>
                    <Input
                      type="url"
                      inputMode="url"
                      placeholder="https://…"
                      aria-label={`Link ${index + 1} URL`}
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-1 self-end sm:self-start">
              <Button type="button" variant="ghost" size="icon" asChild disabled={!field.url}>
                <a
                  href={field.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open link ${index + 1}`}
                >
                  <ExternalLink aria-hidden />
                </a>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                aria-label={`Remove link ${index + 1}`}
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ id: crypto.randomUUID(), title: '', url: '' }, { shouldFocus: true })
        }
      >
        <Plus aria-hidden /> Add link
      </Button>
    </fieldset>
  );
}
