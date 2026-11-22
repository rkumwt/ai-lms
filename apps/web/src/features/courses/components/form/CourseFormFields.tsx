import type { UseFormReturn } from 'react-hook-form';

import { DatePicker } from '@/components/DatePicker';
import { TagsInput } from '@/components/TagsInput';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { CourseLevel } from '@/types';

import { LEVEL_OPTIONS } from '../../constants';
import { useTags } from '../../hooks/useCourses';

import { CategoryCombobox } from './CategoryCombobox';
import type { CourseFormValues } from './courseSchema';
import { CoverUpload } from './CoverUpload';

export function CourseFormFields({ form }: { form: UseFormReturn<CourseFormValues> }) {
  const { data: tagSuggestions = [] } = useTags();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Node.js Deep Dive" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="What do you want to be able to explain by the end?"
                {...field}
              />
            </FormControl>
            <FormDescription>Used by AI to suggest a topic outline.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryCombobox
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="No deadline"
                  disablePast
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel id="level-label">Level</FormLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              value={field.value}
              onValueChange={(v) => v && field.onChange(v as CourseLevel)}
              className="justify-start"
              aria-labelledby="level-label"
            >
              {LEVEL_OPTIONS.map((o) => (
                <ToggleGroupItem key={o.value} value={o.value} className="px-4">
                  {o.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagsInput
                value={field.value}
                onChange={field.onChange}
                suggestions={tagSuggestions}
                invalid={fieldState.invalid}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="coverUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover image</FormLabel>
            <FormControl>
              <CoverUpload value={field.value} onChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
