import { AlertCircle, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAskAiStore, type ChatMessage } from '@/stores/askAiStore';

import { SourceCard } from './SourceCard';
import { TypingText } from './TypingText';

interface ChatBubbleProps {
  message: ChatMessage;
  onNavigate: () => void;
  onRetry: () => void;
}

export function ChatBubble({ message, onNavigate, onRetry }: ChatBubbleProps) {
  const update = useAskAiStore((s) => s.update);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {message.text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div
          className={cn(
            'rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed',
            message.status === 'error' && 'bg-destructive/10',
          )}
        >
          {message.status === 'pending' && (
            <span className="inline-flex gap-1" aria-label="Thinking">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          )}
          {message.status === 'error' && (
            <span className="flex flex-wrap items-center gap-2">
              <AlertCircle className="size-4 text-destructive" aria-hidden /> {message.text}
              <button
                type="button"
                onClick={onRetry}
                className="font-medium text-primary underline"
              >
                Try again
              </button>
            </span>
          )}
          {(message.status === 'typing' || message.status === 'done') && (
            <TypingText
              text={message.text}
              animate={message.status === 'typing'}
              onDone={() => update(message.id, { status: 'done' })}
            />
          )}
        </div>
        {message.status === 'done' && message.sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Sources from your recordings
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {message.sources.map((s) => (
                <SourceCard
                  key={`${s.topicId}-${s.timestampSec}`}
                  source={s}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
