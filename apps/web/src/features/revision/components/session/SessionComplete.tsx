import { PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatReviewDate } from '@/lib/format';

import type { TopicResult } from './SessionTopic';

export function SessionComplete({ results }: { results: TopicResult[] }) {
  const score = results.reduce((s, r) => s + r.score, 0);
  const total = results.reduce((s, r) => s + r.total, 0);
  const pct = total ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <PartyPopper className="mx-auto size-10 text-primary" aria-hidden />
        <h1 className="text-2xl font-semibold">Session complete</h1>
        <p className="text-muted-foreground">
          You revised {results.length} topic{results.length === 1 ? '' : 's'} and scored {score}/
          {total} ({pct}%).
        </p>
      </div>
      <Card className="divide-y shadow-soft">
        {results.map((r) => (
          <div key={r.topicId} className="flex flex-wrap items-center gap-3 p-4">
            <Link
              to={`/topics/${r.topicId}`}
              className="min-w-0 flex-1 truncate font-medium hover:underline"
            >
              {r.title}
            </Link>
            <span className="text-sm tabular-nums text-muted-foreground">
              {r.score}/{r.total}
            </span>
            <ConfidenceBadge confidence={r.confidence} />
            <span className="w-28 text-right text-xs text-muted-foreground">
              {formatReviewDate(r.nextReviewAt)}
            </span>
          </div>
        ))}
      </Card>
      <div className="flex justify-center gap-2">
        <Button variant="outline" asChild>
          <Link to="/courses">Back to courses</Link>
        </Button>
        <Button asChild>
          <Link to="/revision">Revision hub</Link>
        </Button>
      </div>
    </div>
  );
}
