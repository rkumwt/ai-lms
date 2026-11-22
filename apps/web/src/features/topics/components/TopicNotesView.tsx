import { ExternalLink, NotebookPen, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { NotesContent } from '@/components/NotesContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Topic } from '@/types';

export function TopicNotesView({ topic }: { topic: Topic }) {
  const hasNotes = Boolean(topic.notesHtml.replace(/<[^>]+>/g, '').trim());
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Card className="p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            My notes
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/topics/${topic.id}/edit`}>
              <Pencil aria-hidden /> Edit
            </Link>
          </Button>
        </div>
        {hasNotes ? (
          <NotesContent html={topic.notesHtml} />
        ) : (
          <EmptyState icon={NotebookPen} title="No notes" className="border-none py-6" />
        )}
      </Card>
      <Card className="p-5 shadow-soft">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Reading links
        </h3>
        {topic.links.length ? (
          <ul className="space-y-2">
            {topic.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {link.title} <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No links added.</p>
        )}
      </Card>
    </div>
  );
}
