import { ArrowUp, Loader2 } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function ChatComposer({ onSend, busy }: { onSend: (text: string) => void; busy: boolean }) {
  const [text, setText] = useState('');
  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || busy) return;
    onSend(value);
    setText('');
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };
  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Ask about anything you’ve recorded…"
        aria-label="Message Ask AI"
        className="max-h-32 min-h-10 resize-none"
      />
      <Button type="submit" size="icon" disabled={!text.trim() || busy} aria-label="Send message">
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : <ArrowUp aria-hidden />}
      </Button>
    </form>
  );
}
