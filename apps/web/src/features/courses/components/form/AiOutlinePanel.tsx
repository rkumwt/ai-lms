import { Loader2, Plus, RotateCw, Sparkles, Wand2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { SortableList } from '@/components/SortableList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuggestOutline } from '@/features/ai/hooks/useTopicAi';

import type { OutlineItem } from './courseSchema';
import { OutlineRow } from './OutlineRow';

interface AiOutlinePanelProps {
  title: string;
  description: string;
  items: OutlineItem[];
  onItemsChange: (items: OutlineItem[]) => void;
  isEdit: boolean;
}

const newItem = (title: string): OutlineItem => ({ id: crypto.randomUUID(), title, checked: true });

export function AiOutlinePanel({
  title,
  description,
  items,
  onItemsChange,
  isEdit,
}: AiOutlinePanelProps) {
  const suggest = useSuggestOutline();
  const [draft, setDraft] = useState('');
  const canGenerate = title.trim().length >= 3;
  const selected = items.filter((i) => i.checked && i.title.trim()).length;

  const generate = () =>
    suggest.mutate(
      { title, description },
      {
        onSuccess: (titles) => onItemsChange(titles.map(newItem)),
        onError: (e) => toast.error('Could not generate an outline', { description: e.message }),
      },
    );

  const addItem = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onItemsChange([...items, newItem(draft.trim())]);
    setDraft('');
  };

  return (
    <Card className="shadow-soft lg:sticky lg:top-20">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" aria-hidden /> Generate topic outline with AI
        </CardTitle>
        <CardDescription>
          {isEdit
            ? 'Suggested topics are added after your existing ones.'
            : 'Pick the topics to create with this course.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant={items.length ? 'outline' : 'default'}
          className="w-full"
          onClick={generate}
          disabled={!canGenerate || suggest.isPending}
        >
          {suggest.isPending ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : items.length ? (
            <RotateCw aria-hidden />
          ) : (
            <Wand2 aria-hidden />
          )}
          {items.length ? 'Regenerate outline' : 'Generate outline'}
        </Button>
        {!canGenerate && (
          <p className="text-center text-xs text-muted-foreground">Add a course title first.</p>
        )}

        {suggest.isPending ? (
          <div className="space-y-2" aria-busy="true" aria-label="Generating outline">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-9" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <SortableList
            items={items}
            onReorder={onItemsChange}
            getLabel={(i) => i.title || 'Untitled topic'}
          >
            <ol className="space-y-1.5" aria-label="Suggested topics">
              {items.map((item, index) => (
                <OutlineRow
                  key={item.id}
                  item={item}
                  index={index}
                  onChange={(next) =>
                    onItemsChange(items.map((i) => (i.id === next.id ? next : i)))
                  }
                  onRemove={() => onItemsChange(items.filter((i) => i.id !== item.id))}
                />
              ))}
            </ol>
          </SortableList>
        ) : (
          <p className="rounded-md bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            AI suggests an ordered list of topics from your title and description. You can edit,
            reorder and untick any of them.
          </p>
        )}

        <form onSubmit={addItem} className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a topic"
            aria-label="New topic title"
          />
          <Button
            type="submit"
            variant="secondary"
            size="icon"
            aria-label="Add topic"
            disabled={!draft.trim()}
          >
            <Plus aria-hidden />
          </Button>
        </form>

        {items.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span aria-live="polite">
              {selected} of {items.length} topics will be created
            </span>
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() =>
                onItemsChange(items.map((i) => ({ ...i, checked: selected !== items.length })))
              }
            >
              {selected === items.length ? 'Select none' : 'Select all'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
