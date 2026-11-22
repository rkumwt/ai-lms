import { Circle, MoreHorizontal, Pencil, PlayCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUiStore } from '@/stores/uiStore';
import type { Topic } from '@/types';

import { useDeleteTopic } from '../hooks/useTopics';
import { topicHref } from '../topicLinks';

export function TopicActionsMenu({ topic }: { topic: Topic }) {
  const navigate = useNavigate();
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const remove = useDeleteTopic();

  const onDelete = () =>
    remove.mutate(topic.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast.success('Topic deleted', { description: topic.title });
      },
      onError: (e) => toast.error('Could not delete topic', { description: e.message }),
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative z-10 size-8"
            aria-label={`Actions for ${topic.title}`}
          >
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => navigate(topicHref(topic))}>
            <PlayCircle /> Open
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(`/topics/${topic.id}/edit`)}>
            <Pencil /> Edit notes
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openRecordSetup(topic.id)}>
            <Circle className="fill-red-500 text-red-500" />{' '}
            {topic.videoId ? 'Re-record' : 'Record'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this topic?"
        description={
          <>
            <strong className="text-foreground">{topic.title}</strong>, its recording and AI notes
            will be removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete topic"
        destructive
        loading={remove.isPending}
        onConfirm={onDelete}
      />
    </>
  );
}
