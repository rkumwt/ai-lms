import { ChevronLeft, ChevronRight, RotateCw, Shuffle } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/types';

interface FlashcardDeckProps {
  cards: Flashcard[];
  /** Shown on the last card instead of "Next" (e.g. "Continue to quiz" in a study session). */
  finishLabel?: string;
  onFinish?: () => void;
}

/** Flip cards: click or Space/Enter to flip, ←/→ to move. */
export function FlashcardDeck({ cards: initial, finishLabel, onFinish }: FlashcardDeckProps) {
  const [cards, setCards] = useState(initial);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length)
    return (
      <EmptyState
        icon={RotateCw}
        title="No flashcards"
        description="Regenerate flashcards from the review page."
      />
    );
  const card = cards[index] ?? cards[0];
  if (!card) return null;
  const last = index === cards.length - 1;

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(cards.length - 1, next)));
    setFlipped(false);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(index - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <Progress
          value={((index + 1) / cards.length) * 100}
          className="h-1.5"
          aria-label="Deck progress"
        />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={onKeyDown}
        className="group block w-full rounded-xl [perspective:1200px]"
        aria-label={
          flipped
            ? `Answer: ${card.back}. Press to show question.`
            : `Question: ${card.front}. Press to reveal answer.`
        }
      >
        <div
          className={cn(
            'relative min-h-[220px] w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 text-center shadow-soft [backface-visibility:hidden]">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Question
            </span>
            <p className="text-lg font-medium">{card.front}</p>
            <span className="text-xs text-muted-foreground">Click or press Space to flip</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-xs font-medium uppercase tracking-wide text-primary">Answer</span>
            <p className="text-lg">{card.back}</p>
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => go(index - 1)} disabled={index === 0}>
          <ChevronLeft aria-hidden /> Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCards((c) => [...c].sort(() => Math.random() - 0.5));
            go(0);
          }}
        >
          <Shuffle aria-hidden /> Shuffle
        </Button>
        {last && onFinish ? (
          <Button size="sm" onClick={onFinish}>
            {finishLabel ?? 'Done'} <ChevronRight aria-hidden />
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => go(index + 1)} disabled={last}>
            Next <ChevronRight aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}
