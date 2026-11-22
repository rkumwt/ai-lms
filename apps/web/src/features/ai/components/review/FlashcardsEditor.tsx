import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Flashcard } from '@/types';

interface FlashcardsEditorProps {
  value: Flashcard[];
  onChange: (cards: Flashcard[]) => void;
}

export function FlashcardsEditor({ value, onChange }: FlashcardsEditorProps) {
  const patch = (id: string, change: Partial<Flashcard>) =>
    onChange(value.map((c) => (c.id === id ? { ...c, ...change } : c)));

  return (
    <div className="space-y-3">
      <ol className="grid gap-3 md:grid-cols-2">
        {value.map((card, i) => (
          <li key={card.id}>
            <Card className="space-y-3 p-3 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Card {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onChange(value.filter((c) => c.id !== card.id))}
                  aria-label={`Delete card ${i + 1}`}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`fc-front-${card.id}`} className="text-xs">
                  Front
                </Label>
                <Textarea
                  id={`fc-front-${card.id}`}
                  rows={2}
                  value={card.front}
                  onChange={(e) => patch(card.id, { front: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`fc-back-${card.id}`} className="text-xs">
                  Back
                </Label>
                <Textarea
                  id={`fc-back-${card.id}`}
                  rows={2}
                  value={card.back}
                  onChange={(e) => patch(card.id, { back: e.target.value })}
                />
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { id: crypto.randomUUID(), front: '', back: '' }])}
      >
        <Plus aria-hidden /> Add card
      </Button>
    </div>
  );
}
