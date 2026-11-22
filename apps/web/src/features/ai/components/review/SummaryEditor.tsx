import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SummaryEditorProps {
  summary: string;
  keyPoints: string[];
  onSummaryChange: (summary: string) => void;
  onKeyPointsChange: (points: string[]) => void;
}

export function SummaryEditor({
  summary,
  keyPoints,
  onSummaryChange,
  onKeyPointsChange,
}: SummaryEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ai-summary">Summary</Label>
        <Textarea
          id="ai-summary"
          rows={6}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Key points</legend>
        <ol className="space-y-2">
          {keyPoints.map((point, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-5 text-right text-xs text-muted-foreground">{i + 1}.</span>
              <Input
                value={point}
                onChange={(e) =>
                  onKeyPointsChange(keyPoints.map((p, j) => (j === i ? e.target.value : p)))
                }
                aria-label={`Key point ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onKeyPointsChange(keyPoints.filter((_, j) => j !== i))}
                aria-label={`Remove key point ${i + 1}`}
              >
                <X aria-hidden />
              </Button>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onKeyPointsChange([...keyPoints, ''])}
        >
          <Plus aria-hidden /> Add key point
        </Button>
      </fieldset>
    </div>
  );
}
