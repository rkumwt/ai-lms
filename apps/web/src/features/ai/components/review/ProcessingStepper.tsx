import { AlertTriangle, Check, Loader2, RotateCw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PROCESSING_STAGES, type ProcessingJob, type ProcessingStage } from '@/types';

import { STAGE_META } from '../../constants';

type StepState = 'done' | 'active' | 'failed' | 'pending';

function stepState(job: ProcessingJob, stage: ProcessingStage, index: number): StepState {
  const current = job.stage === 'failed' ? job.failedStage : job.stage;
  const currentIndex = current ? PROCESSING_STAGES.indexOf(current) : -1;
  if (job.stage === 'ready') return 'done';
  if (job.stage === 'failed' && stage === job.failedStage) return 'failed';
  if (index < currentIndex) return 'done';
  if (index === currentIndex && job.stage !== 'failed') return 'active';
  return 'pending';
}

const ICON: Record<StepState, typeof Check> = {
  done: Check,
  active: Loader2,
  failed: X,
  pending: Check,
};

interface ProcessingStepperProps {
  job: ProcessingJob;
  onRetry: () => void;
  retrying?: boolean;
}

export function ProcessingStepper({ job, onRetry, retrying }: ProcessingStepperProps) {
  const steps = PROCESSING_STAGES.filter((s) => s !== 'ready');
  const failed = job.stage === 'failed';
  const ready = job.stage === 'ready';
  const headline =
    job.stage === 'ready'
      ? 'AI processing complete'
      : job.stage === 'failed'
        ? 'Processing failed'
        : `${STAGE_META[job.stage].description}…`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium" aria-live="polite">
          {headline}
        </p>
        <span className="text-xs tabular-nums text-muted-foreground">{job.progress}%</span>
      </div>
      <Progress
        value={job.progress}
        aria-label="AI processing progress"
        className={cn('h-1.5', ready && '[&>div]:bg-success', failed && '[&>div]:bg-destructive')}
      />
      <ol className="grid gap-3 sm:grid-cols-5" aria-label="Processing steps">
        {steps.map((stage, index) => {
          const state = stepState(job, stage, index);
          const Icon = ICON[state];
          return (
            <li
              key={stage}
              className="flex items-center gap-2 sm:flex-col sm:text-center"
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-muted-foreground',
                  state === 'done' && 'border-success bg-success text-success-foreground',
                  state === 'active' && 'border-primary text-primary',
                  state === 'failed' &&
                    'border-destructive bg-destructive text-destructive-foreground',
                )}
              >
                {state === 'pending' ? (
                  <span className="text-xs font-semibold">{index + 1}</span>
                ) : (
                  <Icon
                    className={cn('size-4', state === 'active' && 'animate-spin')}
                    aria-hidden
                  />
                )}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  state === 'pending' && 'text-muted-foreground',
                )}
              >
                {STAGE_META[stage].label}
                <span className="sr-only"> — {state}</span>
              </span>
            </li>
          );
        })}
      </ol>
      {failed && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 sm:flex-row sm:items-center"
        >
          <AlertTriangle className="size-5 shrink-0 text-destructive" aria-hidden />
          <p className="flex-1 text-sm">{job.error}</p>
          <Button size="sm" variant="outline" onClick={onRetry} disabled={retrying}>
            {retrying ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}{' '}
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
