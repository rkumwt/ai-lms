import { zodResolver } from '@hookform/resolvers/zod';
import { Circle, Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { TagsInput } from '@/components/TagsInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTags } from '@/features/courses/hooks/useCourses';
import { useUiStore } from '@/stores/uiStore';
import type { TopicInput, TopicWithCourse } from '@/types';

import { useCreateTopic, useUpdateTopic } from '../../hooks/useTopics';

import { AiAssistPanel } from './AiAssistPanel';
import { ReadingLinksField } from './ReadingLinksField';
import { RichTextEditor } from './RichTextEditor';
import { EMPTY_TOPIC, topicSchema, type TopicFormValues } from './topicSchema';
import { useNotesEditor } from './useNotesEditor';

interface TopicEditorProps {
  courseId: string;
  topic?: TopicWithCourse;
}

export function TopicEditor({ courseId, topic }: TopicEditorProps) {
  const navigate = useNavigate();
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);
  const { data: tagSuggestions = [] } = useTags();
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topic
      ? { title: topic.title, tags: topic.tags, notesHtml: topic.notesHtml, links: topic.links }
      : EMPTY_TOPIC,
  });
  const editor = useNotesEditor(form.getValues('notesHtml'), (html) =>
    form.setValue('notesHtml', html, { shouldDirty: true }),
  );
  const create = useCreateTopic(courseId);
  const update = useUpdateTopic(topic?.id ?? '');
  const pending = create.isPending || update.isPending;

  /** Saves the topic and resolves with its id (creating it first if new). */
  const save = async (values: TopicFormValues): Promise<string> => {
    const input: TopicInput = values;
    if (topic) {
      await update.mutateAsync(input);
      form.reset(values);
      return topic.id;
    }
    const created = await create.mutateAsync(input);
    return created.id;
  };

  const onSave = form.handleSubmit(async (values) => {
    try {
      await save(values);
      toast.success(topic ? 'Topic saved' : 'Topic created');
      navigate(`/courses/${courseId}`);
    } catch (e) {
      toast.error('Could not save the topic', {
        description: e instanceof Error ? e.message : undefined,
      });
    }
  });

  const onRecord = form.handleSubmit(async (values) => {
    try {
      // Always save first so the studio's teleprompter shows the latest notes.
      const id = await save(values);
      if (!topic) navigate(`/topics/${id}/edit`, { replace: true });
      openRecordSetup(id);
    } catch (e) {
      toast.error('Save the topic before recording', {
        description: e instanceof Error ? e.message : undefined,
      });
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSave}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <Card className="shadow-soft">
          <CardContent className="space-y-6 p-4 sm:p-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. The Event Loop Explained"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes</p>
              <RichTextEditor editor={editor} />
              <p className="text-xs text-muted-foreground">
                Shown as a teleprompter while you record.
              </p>
            </div>
            <ReadingLinksField form={form} />
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-20">
          <Card className="shadow-soft">
            <CardContent className="space-y-3 p-4">
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => void onRecord()}
                disabled={pending}
              >
                <Circle className="fill-red-400 text-red-400" aria-hidden /> Record explanation
              </Button>
              <Button type="submit" variant="outline" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
                {topic ? 'Save changes' : 'Save as draft'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Recording saves your notes first.
              </p>
            </CardContent>
          </Card>
          <AiAssistPanel editor={editor} getTitle={() => form.getValues('title')} />
        </div>
      </form>
    </Form>
  );
}
