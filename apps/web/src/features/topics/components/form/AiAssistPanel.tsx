import type { Editor } from '@tiptap/react';
import { ListChecks, Loader2, MessageCircleQuestion, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuggestInterviewQuestions, useSuggestKeyPoints } from '@/features/ai/hooks/useTopicAi';

type Mode = 'points' | 'questions';

interface AiAssistPanelProps {
  editor: Editor | null;
  getTitle: () => string;
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function AiAssistPanel({ editor, getTitle }: AiAssistPanelProps) {
  const keyPoints = useSuggestKeyPoints();
  const questions = useSuggestInterviewQuestions();
  const [mode, setMode] = useState<Mode | null>(null);
  const active = mode === 'points' ? keyPoints : mode === 'questions' ? questions : null;
  const items = active?.data ?? [];

  const run = (next: Mode) => {
    setMode(next);
    const onError = (e: Error) => toast.error('AI suggestion failed', { description: e.message });
    if (next === 'points')
      keyPoints.mutate({ title: getTitle(), notesHtml: editor?.getHTML() ?? '' }, { onError });
    else questions.mutate(getTitle(), { onError });
  };

  const insert = () => {
    if (!editor || !items.length) return;
    const heading = mode === 'points' ? 'Key points' : 'Interview questions';
    const list = mode === 'points' ? 'ul' : 'ol';
    const html = `<h3>${heading}</h3><${list}>${items.map((i) => `<li>${escape(i)}</li>`).join('')}</${list}>`;
    editor.chain().focus('end').insertContent(html).run();
    toast.success(`${heading} added to your notes`);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" aria-hidden /> AI assist
        </CardTitle>
        <CardDescription>Draft key points and practice questions from your notes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => run('points')}
            disabled={keyPoints.isPending}
          >
            {keyPoints.isPending ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <ListChecks aria-hidden />
            )}
            Suggest key points from notes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => run('questions')}
            disabled={questions.isPending}
          >
            {questions.isPending ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <MessageCircleQuestion aria-hidden />
            )}
            Suggest interview questions
          </Button>
        </div>

        <div aria-live="polite">
          {active?.isPending && (
            <div className="space-y-2" aria-label="Generating suggestions">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          )}
          {!active?.isPending && items.length > 0 && (
            <div className="space-y-3 rounded-md bg-muted/50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {mode === 'points' ? 'Suggested key points' : 'Suggested interview questions'}
              </p>
              <ol className="list-decimal space-y-1.5 pl-4 text-sm">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={insert}
                disabled={!editor}
              >
                <Plus aria-hidden /> Insert into notes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
