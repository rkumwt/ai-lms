import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionComplete } from '@/features/revision/components/session/SessionComplete';
import {
  SessionTopic,
  type TopicResult,
} from '@/features/revision/components/session/SessionTopic';
import { useSessionQueue } from '@/features/revision/hooks/useSessionQueue';

export default function StudySessionPage() {
  const [params] = useSearchParams();
  const courseId = params.get('course') ?? undefined;
  const { queue, error, courseTitle } = useSessionQueue(courseId);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<TopicResult[]>([]);

  const header = (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Study session
        </p>
        <p className="text-sm text-muted-foreground">{courseTitle ?? 'All courses · due today'}</p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/revision">
          <X aria-hidden /> End session
        </Link>
      </Button>
    </div>
  );

  if (error) return <ErrorState title="Could not start the session" error={error} />;
  if (!queue) {
    return (
      <div className="mx-auto max-w-4xl space-y-6" aria-busy="true" aria-label="Preparing session">
        <Skeleton className="h-10" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }
  if (!queue.length) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {header}
        <EmptyState
          icon={CheckCircle2}
          title="Nothing to revise"
          description={
            courseId
              ? 'This course has no processed topics yet.'
              : 'No topics are due today. Nice work!'
          }
          action={
            <Button asChild>
              <Link to="/revision">Back to revision</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const item = queue[index];
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {header}
      {item ? (
        <SessionTopic
          key={item.topicId}
          item={item}
          index={index}
          total={queue.length}
          onDone={(result) => {
            setResults((r) => [...r, result]);
            setIndex((i) => i + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <SessionComplete results={results} />
      )}
    </div>
  );
}
