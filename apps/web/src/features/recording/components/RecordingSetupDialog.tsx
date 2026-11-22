import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useTopic } from '@/features/topics/hooks/useTopics';
import { useUiStore } from '@/stores/uiStore';

import { SetupForm } from './setup/SetupForm';

export function RecordingSetupDialog() {
  const { open, topicId } = useUiStore((s) => s.recordSetup);
  const close = useUiStore((s) => s.closeRecordSetup);
  const settings = useSettings();
  const topic = useTopic(topicId ?? undefined);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record explanation</DialogTitle>
          <DialogDescription>
            {topic.data ? `Topic: ${topic.data.title}` : 'Pick a topic, a source and your devices.'}
          </DialogDescription>
        </DialogHeader>
        {settings.data ? (
          open && (
            <SetupForm
              key={topicId ?? 'none'}
              initialTopicId={topicId}
              initialCourseId={topic.data?.courseId ?? null}
              defaults={settings.data.recording}
              onDone={close}
            />
          )
        ) : (
          <Skeleton className="h-80 rounded-lg" />
        )}
      </DialogContent>
    </Dialog>
  );
}
