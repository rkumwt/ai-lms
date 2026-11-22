import { ClipboardCheck, RotateCw, Trophy } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { QuizQuestion } from '@/types';

import { QuizQuestionView } from './QuizQuestionView';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  /** Called once when the last question is answered. */
  onComplete?: (score: number, total: number) => void;
  /** Hide the built-in result screen (the caller shows its own). */
  hideResult?: boolean;
}

/** One question at a time: answer → check → explanation → next, then a score screen. */
export function QuizRunner({ questions, onComplete, hideResult }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions.length)
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="No quiz questions"
        description="Regenerate the quiz from the review page."
      />
    );

  const question = questions[index];
  const restart = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  };

  if (done || !question) {
    if (hideResult) return null;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-soft">
        <Trophy className="mx-auto size-10 text-warning" aria-hidden />
        <h3 className="text-xl font-semibold">
          {score} / {questions.length} correct
        </h3>
        <p className="text-sm text-muted-foreground">
          {pct >= 80
            ? 'Great recall — this topic is sticking.'
            : pct >= 50
              ? 'Good effort. Revisit the explanations you missed.'
              : 'Worth another look at the summary and flashcards.'}
        </p>
        <Button variant="outline" onClick={restart}>
          <RotateCw aria-hidden /> Try again
        </Button>
      </div>
    );
  }

  const next = () => {
    const last = index === questions.length - 1;
    if (last) {
      setDone(true);
      onComplete?.(score, questions.length);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <Progress
          value={(index / questions.length) * 100}
          className="h-1.5"
          aria-label="Quiz progress"
        />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <QuizQuestionView
        key={question.id}
        question={question}
        selected={selected}
        checked={checked}
        onSelect={setSelected}
      />
      <div className="flex justify-end">
        {checked ? (
          <Button onClick={next}>
            {index === questions.length - 1 ? 'See results' : 'Next question'}
          </Button>
        ) : (
          <Button
            disabled={selected === null}
            onClick={() => {
              setChecked(true);
              if (selected === question.correctIndex) setScore((s) => s + 1);
            }}
          >
            Check answer
          </Button>
        )}
      </div>
    </div>
  );
}
