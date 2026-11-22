import { CheckCircle2, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/types';

interface QuizQuestionViewProps {
  question: QuizQuestion;
  selected: number | null;
  checked: boolean;
  onSelect: (index: number) => void;
}

export function QuizQuestionView({ question, selected, checked, onSelect }: QuizQuestionViewProps) {
  const correct = selected === question.correctIndex;
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-medium">{question.question}</legend>
      {question.options.map((option, i) => {
        const isCorrect = i === question.correctIndex;
        const isSelected = i === selected;
        return (
          <label
            key={i}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-muted/50',
              isSelected && !checked && 'border-primary bg-primary/5',
              checked && isCorrect && 'border-success bg-success/10',
              checked && isSelected && !isCorrect && 'border-destructive bg-destructive/10',
              checked && 'cursor-default hover:bg-transparent',
            )}
          >
            <input
              type="radio"
              name={`quiz-${question.id}`}
              checked={isSelected}
              disabled={checked}
              onChange={() => onSelect(i)}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            <span className="flex-1">{option}</span>
            {checked && isCorrect && (
              <CheckCircle2 className="size-4 text-success" aria-label="Correct answer" />
            )}
            {checked && isSelected && !isCorrect && (
              <XCircle className="size-4 text-destructive" aria-label="Your answer" />
            )}
          </label>
        );
      })}
      {checked && (
        <div
          role="status"
          className={cn('rounded-lg p-3 text-sm', correct ? 'bg-success/10' : 'bg-destructive/10')}
        >
          <p className="font-medium">{correct ? 'Correct!' : 'Not quite.'}</p>
          <p className="mt-1 text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </fieldset>
  );
}
