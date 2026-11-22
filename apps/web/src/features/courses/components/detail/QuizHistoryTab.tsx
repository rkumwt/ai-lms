import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuizAttempts } from '@/features/revision/hooks/useRevision';
import { formatDate } from '@/lib/format';

function scoreVariant(pct: number) {
  if (pct >= 80) return 'success' as const;
  if (pct >= 50) return 'warning' as const;
  return 'destructive' as const;
}

export function QuizHistoryTab({ courseId }: { courseId: string }) {
  const attempts = useQuizAttempts(courseId);

  if (attempts.isPending) return <Skeleton className="h-64 rounded-xl" />;
  if (attempts.error)
    return <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} />;
  if (!attempts.data.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No quiz attempts yet"
        description="Finish a revision session and your scores will show up here."
      />
    );
  }

  const average = Math.round(
    (attempts.data.reduce((sum, a) => sum + a.score / a.total, 0) / attempts.data.length) * 100,
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {attempts.data.length} attempts · average score{' '}
        <strong className="text-foreground">{average}%</strong>
      </p>
      <Card className="overflow-x-auto shadow-soft">
        <table className="w-full text-sm">
          <caption className="sr-only">Quiz attempts for this course</caption>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Date
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Topic
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {attempts.data.map((a) => {
              const pct = Math.round((a.score / a.total) * 100);
              return (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(a.takenAt, 'd MMM, HH:mm')}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/topics/${a.topicId}`} className="font-medium hover:underline">
                      {a.topicTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={scoreVariant(pct)} className="tabular-nums">
                      {a.score}/{a.total} · {pct}%
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
