import { Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAskAiStore } from '@/stores/askAiStore';
import { useUiStore } from '@/stores/uiStore';

import { useAskAi, useSuggestedQuestions } from '../hooks/useTopicAi';

import { ChatBubble } from './ask/ChatBubble';
import { ChatComposer } from './ask/ChatComposer';

export function AskAiSheet() {
  const open = useUiStore((s) => s.askAiOpen);
  const setOpen = useUiStore((s) => s.setAskAiOpen);
  const { messages, add, update, clear } = useAskAiStore();
  const ask = useAskAi();
  const suggestions = useSuggestedQuestions();
  const logRef = useRef<HTMLDivElement>(null);
  const busy = ask.isPending || messages.some((m) => m.status === 'typing');
  const lastDone = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant' && m.status === 'done');

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (question: string) => {
    add({ id: crypto.randomUUID(), role: 'user', text: question, sources: [], status: 'done' });
    const replyId = crypto.randomUUID();
    add({ id: replyId, role: 'assistant', text: '', sources: [], status: 'pending' });
    ask.mutate(question, {
      onSuccess: (answer) =>
        update(replyId, { text: answer.answer, sources: answer.sources, status: 'typing' }),
      onError: (e) =>
        update(replyId, { text: e.message || 'Something went wrong.', status: 'error' }),
    });
  };

  const retry = (replyIndex: number) => {
    const question = messages[replyIndex - 1];
    const reply = messages[replyIndex];
    if (!question || !reply) return;
    update(reply.id, { status: 'pending', text: '' });
    ask.mutate(question.text, {
      onSuccess: (answer) =>
        update(reply.id, { text: answer.answer, sources: answer.sources, status: 'typing' }),
      onError: (e) => update(reply.id, { text: e.message, status: 'error' }),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b px-4 py-3 pr-12 text-left">
          <div className="flex items-center gap-2">
            <SheetTitle className="flex flex-1 items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden /> Ask AI
            </SheetTitle>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} disabled={busy}>
                <Trash2 aria-hidden /> Clear
              </Button>
            )}
          </div>
          <SheetDescription>
            Answers come from your own recordings, with links to the exact moment.
          </SheetDescription>
        </SheetHeader>

        <div
          ref={logRef}
          role="log"
          aria-live="off"
          aria-label="Conversation"
          className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-4"
        >
          {messages.length === 0 && (
            <div className="space-y-4 py-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">
                Ask a question about anything you’ve explained on camera.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <ChatBubble
              key={m.id}
              message={m}
              onNavigate={() => setOpen(false)}
              onRetry={() => retry(i)}
            />
          ))}
        </div>

        {/* Announce finished answers once, instead of every typed word. */}
        <p className="sr-only" aria-live="polite">
          {lastDone ? `Ask AI answered: ${lastDone.text}` : ''}
        </p>
        <div className="space-y-2 px-3 pt-2">
          {suggestions.isPending ? (
            <Skeleton className="h-7 w-2/3" />
          ) : (
            <div
              className="scrollbar-thin flex gap-2 overflow-x-auto pb-1"
              aria-label="Suggested questions"
            >
              {suggestions.data?.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  disabled={busy}
                  className="shrink-0 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <ChatComposer onSend={send} busy={busy} />
      </SheetContent>
    </Sheet>
  );
}
