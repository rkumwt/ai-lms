import { CheckCircle2 } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function SummaryView({ summary, keyPoints }: { summary: string; keyPoints: string[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Card className="p-5 shadow-soft">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Summary
        </h3>
        <p className="leading-relaxed">{summary}</p>
      </Card>
      <Card className="p-5 shadow-soft">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Key points
        </h3>
        <ul className="space-y-2.5">
          {keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
