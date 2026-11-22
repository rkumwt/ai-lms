import { BookText, ClipboardCheck, Layers, Trophy } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type SessionPhase = 'summary' | 'flashcards' | 'quiz' | 'score';

const PHASES: { id: SessionPhase; label: string; icon: typeof BookText }[] = [
  { id: 'summary', label: 'Summary', icon: BookText },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: ClipboardCheck },
  { id: 'score', label: 'Score', icon: Trophy },
];

interface SessionProgressProps {
  index: number;
  total: number;
  phase: SessionPhase;
}

export function SessionProgress({ index, total, phase }: SessionProgressProps) {
  const phaseIndex = PHASES.findIndex((p) => p.id === phase);
  const overall = ((index + (phaseIndex + 1) / PHASES.length) / total) * 100;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Progress value={overall} className="h-2" aria-label="Session progress" />
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          Topic {Math.min(index + 1, total)} of {total}
        </span>
      </div>
      <ol className="flex flex-wrap gap-2" aria-label="Steps for this topic">
        {PHASES.map((p, i) => (
          <li
            key={p.id}
            aria-current={p.id === phase ? 'step' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
              i < phaseIndex && 'border-success/40 text-success',
              p.id === phase && 'border-primary bg-primary/10 font-medium text-primary',
              i > phaseIndex && 'text-muted-foreground',
            )}
          >
            <p.icon className="size-3.5" aria-hidden /> {p.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
