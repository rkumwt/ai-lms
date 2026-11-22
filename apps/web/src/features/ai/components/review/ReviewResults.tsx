import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useLeaveGuard } from '@/features/recording/hooks/useLeaveGuard';
import type { TopicAi } from '@/types';

import { useAiDraft } from '../../hooks/useAiDraft';
import { useUpdateTopicAi } from '../../hooks/useTopicAi';

import { AiResultsTabs } from './AiResultsTabs';

/** Editable AI results plus "Save to topic"; warns before leaving with unsaved edits. */
export function ReviewResults({ ai }: { ai: TopicAi }) {
  const navigate = useNavigate();
  const { draft, dirty, update, applySection } = useAiDraft(ai);
  const save = useUpdateTopicAi(ai.topicId);
  const guard = useLeaveGuard(dirty);

  if (!draft) return null;

  const onSave = async () => {
    try {
      if (dirty) await save.mutateAsync(draft);
      guard.allow();
      toast.success('Saved to topic', { description: 'Your edits are now part of this topic.' });
      navigate(`/topics/${ai.topicId}`);
    } catch (e) {
      toast.error('Could not save', { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <section aria-labelledby="ai-results-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="ai-results-heading" className="text-lg font-semibold">
            AI results
          </h2>
          <p className="text-sm text-muted-foreground">
            {dirty ? 'You have unsaved edits.' : 'Review and edit anything before saving.'}
          </p>
        </div>
        <Button onClick={() => void onSave()} disabled={save.isPending}>
          {save.isPending ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <Check aria-hidden />
          )}
          Save to topic
        </Button>
      </div>
      <AiResultsTabs
        topicId={ai.topicId}
        draft={draft}
        update={update}
        onRegenerated={applySection}
      />
      <ConfirmDialog
        open={guard.blocker.state === 'blocked'}
        onOpenChange={(open) => !open && guard.blocker.reset?.()}
        title="Discard your edits?"
        description="You changed the AI results but haven’t saved them to the topic."
        confirmLabel="Discard edits"
        destructive
        onConfirm={() => guard.blocker.proceed?.()}
      />
    </section>
  );
}
