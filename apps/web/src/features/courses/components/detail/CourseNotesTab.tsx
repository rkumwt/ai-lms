import { NotebookPen, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { NotesContent } from '@/components/NotesContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopics } from '@/features/topics/hooks/useTopics';

export function CourseNotesTab({ courseId }: { courseId: string }) {
  const topics = useTopics(courseId);

  if (topics.isPending) return <Skeleton className="h-64 rounded-xl" />;
  if (topics.error)
    return <ErrorState error={topics.error} onRetry={() => void topics.refetch()} />;

  const withNotes = topics.data.filter((t) => t.notesHtml.replace(/<[^>]+>/g, '').trim());
  if (!withNotes.length) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="No notes yet"
        description="Notes you write for each topic appear here, in course order."
      />
    );
  }

  return (
    <div className="space-y-4">
      {withNotes.map((topic) => (
        <Card key={topic.id} className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">
              <span className="mr-2 text-muted-foreground">{topic.order}.</span>
              {topic.title}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/topics/${topic.id}/edit`} aria-label={`Edit notes for ${topic.title}`}>
                <Pencil aria-hidden /> Edit
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <NotesContent html={topic.notesHtml} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
