import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { SOURCE_META } from '@/features/recording/sources';
import type { Settings } from '@/types';

import { useUpdateSettings } from '../hooks/useSettings';

import { ChoiceField } from './ChoiceField';
import { SaveBar } from './SaveBar';
import { SettingsSection } from './SettingsSection';
import { SwitchField } from './SwitchField';
import { settingsSchema, type SettingsFormValues } from './settingsSchema';

const SOURCES = Object.entries(SOURCE_META).map(([value, meta]) => ({ value, label: meta.label }));

export function SettingsForm({ settings }: { settings: Settings }) {
  const { theme: activeTheme, setTheme } = useTheme();
  const save = useUpdateSettings();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    // Start from the theme actually in use (it can be changed from the top bar too).
    defaultValues: {
      ...settings,
      theme: (activeTheme as Settings['theme'] | undefined) ?? settings.theme,
    },
  });
  const { isDirty } = form.formState;
  const theme = useWatch({ control: form.control, name: 'theme' });

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(values, {
      onSuccess: (saved) => {
        form.reset(saved);
        toast.success('Settings saved');
      },
      onError: (e) => toast.error('Could not save settings', { description: e.message }),
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-6 pb-20">
        <SettingsSection id="profile" title="Profile" description="How you appear in the app.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="profile.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="profile.bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <SettingsSection
          id="recording"
          title="Recording defaults"
          description="Pre-selected in the recording setup."
        >
          <ChoiceField
            form={form}
            name="recording.source"
            label="Default source"
            options={SOURCES}
          />
          <ChoiceField
            form={form}
            name="recording.quality"
            label="Quality"
            options={[
              { value: '720p', label: '720p' },
              { value: '1080p', label: '1080p' },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <SwitchField
              form={form}
              name="recording.countdown"
              label="3-second countdown"
              description="Count down before recording starts."
            />
            <SwitchField
              form={form}
              name="recording.teleprompter"
              label="Teleprompter"
              description="Show your notes while recording."
            />
          </div>
        </SettingsSection>

        <SettingsSection
          id="ai"
          title="AI preferences"
          description="Applied the next time a recording is processed."
        >
          <ChoiceField
            form={form}
            name="ai.summaryLength"
            label="Summary length"
            options={[
              { value: 'short', label: 'Short' },
              { value: 'medium', label: 'Medium' },
              { value: 'long', label: 'Long' },
            ]}
          />
          <ChoiceField
            form={form}
            name="ai.quizDifficulty"
            label="Quiz difficulty"
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
          <FormField
            control={form.control}
            name="ai.flashcardCount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Flashcards per topic</FormLabel>
                  <span className="text-sm font-medium tabular-nums">{field.value}</span>
                </div>
                <FormControl>
                  <Slider
                    min={3}
                    max={15}
                    step={1}
                    value={[field.value]}
                    onValueChange={([v]) => field.onChange(v ?? field.value)}
                    aria-label="Flashcards per topic"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </SettingsSection>

        <SettingsSection
          id="appearance"
          title="Appearance"
          description="Theme changes apply immediately."
        >
          <ChoiceField
            form={form}
            name="theme"
            label="Theme"
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
          />
        </SettingsSection>

        <SaveBar dirty={isDirty} saving={save.isPending} onReset={() => form.reset()} />
      </form>
    </Form>
  );
}
