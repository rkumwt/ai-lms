import { ArrowRight, CalendarClock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryView } from '@/features/ai/components/player/SummaryView';
import { FlashcardDeck } from '@/features/ai/components/study/FlashcardDeck';
import { QuizRunner } from '@/features/ai/components/study/QuizRunner';
import { useTopicAi } from '@/features/ai/hooks/useTopicAi';
import { formatReviewDate } from '@/lib/format';
import type { Confidence } from '@/types';

import { useRecordSessionResult } from '../../hooks/useRevision';
import type { SessionItem } from '../../hooks/useSessionQueue';

import { SessionProgress, type SessionPhase } from './SessionProgress';

export interface TopicResult {
  topicId: string;
  title: string;
  score: number;
  total: number;
  confidence: Confidence | null;
  nextReviewAt: string | null;
}

interface SessionTopicProps {
  item: SessionItem;
  index: number;
  total: number;
  onDone: (result: TopicResult) => void;
}

/** Runs one topic: summary → flashcards → 3–5 quiz questions → score. */
export function SessionTopic({ item, index, total, onDone }: SessionTopicProps) {
  const ai = useTopicAi(item.topicId);
  const record = useRecordSessionResult();
  const [phase, setPhase] = useState<SessionPhase>('summary');
  const [result, setResult] = useState<TopicResult | null>(null);
  const last = index === total - 1;

  const onQuizComplete = (score: number, count: number) => {
    setPhase('score');
    record.mutate(
      { topicId: item.topicId, score, total: count },
      {
        onSuccess: (topic) =>
          setResult({
            topicId: item.topicId,
            title: item.title,
            score,
            total: count,
            confidence: topic.confidence,
            nextReviewAt: topic.nextReviewAt,
          }),
        onError: (e) => {
          toast.error('Could not save your score', { description: e.message });
          setResult({
            topicId: item.topicId,
            title: item.title,
            score,
            total: count,
            confidence: null,
            nextReviewAt: null,
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <SessionProgress index={index} total={total} phase={phase} />
      <div>
        <p className="text-sm text-muted-foreground">{item.courseTitle}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
      </div>

      {ai.isPending && <Skeleton className="h-64 rounded-xl" />}
      {ai.error && <ErrorState error={ai.error} onRetry={() => void ai.refetch()} />}
      {ai.data === null && (
        <ErrorState
          title="No AI material for this topic"
          error="Process the recording first, then revise it."
        />
      )}

      {ai.data && phase === 'summary' && (
        <div className="space-y-4">
          <SummaryView summary={ai.data.summary} keyPoints={ai.data.keyPoints} />
          <div className="flex justify-end">
            <Button onClick={() => setPhase('flashcards')}>
              Continue to flashcards <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>
      )}
      {ai.data && phase === 'flashcards' && (
        <FlashcardDeck
          cards={ai.data.flashcards}
          finishLabel="Continue to quiz"
          onFinish={() => setPhase('quiz')}
        />
      )}
      {ai.data && phase === 'quiz' && (
        <QuizRunner questions={ai.data.quiz.slice(0, 5)} onComplete={onQuizComplete} hideResult />
      )}
      {phase === 'score' && (
        <Card className="mx-auto max-w-md space-y-4 p-8 text-center shadow-soft" aria-live="polite">
          {!result ? (
            <Loader2
              className="mx-auto size-6 animate-spin text-muted-foreground"
              aria-label="Saving score"
            />
          ) : (
            <>
              <p className="text-4xl font-bold tabular-nums">
                {result.score}/{result.total}
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.round((result.score / Math.max(1, result.total)) * 100)}% correct
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                New confidence: <ConfidenceBadge confidence={result.confidence} />
              </div>
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <CalendarClock className="size-4" aria-hidden /> Next review:{' '}
                {formatReviewDate(result.nextReviewAt)}
              </p>
              <Button className="w-full" onClick={() => onDone(result)}>
                {last ? 'Finish session' : 'Next topic'} <ArrowRight aria-hidden />
              </Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
