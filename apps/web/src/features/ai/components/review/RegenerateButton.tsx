import { Loader2, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { AiSection, TopicAi } from '@/types';

import { useRegenerateSection } from '../../hooks/useTopicAi';

const LABEL: Record<AiSection, string> = {
  transcript: 'transcript',
  summary: 'summary',
  flashcards: 'flashcards',
  quiz: 'quiz',
};

interface RegenerateButtonProps {
  topicId: string;
  section: AiSection;
  onRegenerated: (ai: TopicAi, section: AiSection) => void;
}

export function RegenerateButton({ topicId, section, onRegenerated }: RegenerateButtonProps) {
  const regenerate = useRegenerateSection(topicId);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={regenerate.isPending}
      onClick={() =>
        regenerate.mutate(section, {
          onSuccess: (ai) => {
            onRegenerated(ai, section);
            toast.success(`New ${LABEL[section]} generated`);
          },
          onError: (e) => toast.error('Could not regenerate', { description: e.message }),
        })
      }
    >
      {regenerate.isPending ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : (
        <RotateCw aria-hidden />
      )}
      Regenerate
    </Button>
  );
}
