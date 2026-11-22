import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { QuizQuestion } from '@/types';

interface QuizEditorProps {
  value: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

const blank = (): QuizQuestion => ({
  id: crypto.randomUUID(),
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
});

export function QuizEditor({ value, onChange }: QuizEditorProps) {
  const patch = (id: string, change: Partial<QuizQuestion>) =>
    onChange(value.map((q) => (q.id === id ? { ...q, ...change } : q)));

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {value.map((q, i) => (
          <li key={q.id}>
            <Card className="space-y-3 p-4 shadow-soft">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`qq-${q.id}`}>Question {i + 1}</Label>
                  <Input
                    id={`qq-${q.id}`}
                    value={q.question}
                    onChange={(e) => patch(q.id, { question: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => onChange(value.filter((x) => x.id !== q.id))}
                  aria-label={`Delete question ${i + 1}`}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
              <fieldset className="space-y-2">
                <legend className="mb-1 text-xs text-muted-foreground">
                  Options — select the correct answer
                </legend>
                {q.options.map((option, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === oi}
                      onChange={() => patch(q.id, { correctIndex: oi })}
                      className="size-4 accent-[hsl(var(--success))]"
                      aria-label={`Mark option ${oi + 1} as correct`}
                    />
                    <Input
                      value={option}
                      onChange={(e) =>
                        patch(q.id, {
                          options: q.options.map((o, j) => (j === oi ? e.target.value : o)),
                        })
                      }
                      aria-label={`Question ${i + 1} option ${oi + 1}`}
                      className={q.correctIndex === oi ? 'border-success' : undefined}
                    />
                  </div>
                ))}
              </fieldset>
              <div className="space-y-1">
                <Label htmlFor={`qe-${q.id}`} className="text-xs">
                  Explanation
                </Label>
                <Textarea
                  id={`qe-${q.id}`}
                  rows={2}
                  value={q.explanation}
                  onChange={(e) => patch(q.id, { explanation: e.target.value })}
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
        onClick={() => onChange([...value, blank()])}
      >
        <Plus aria-hidden /> Add question
      </Button>
    </div>
  );
}
