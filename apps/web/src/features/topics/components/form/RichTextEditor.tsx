import { EditorContent, type Editor } from '@tiptap/react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  editor: Editor | null;
  invalid?: boolean;
  id?: string;
}

export function RichTextEditor({ editor, invalid, id }: RichTextEditorProps) {
  if (!editor) return <Skeleton className="h-72 rounded-md" />;
  return (
    <div
      id={id}
      className={cn(
        'overflow-hidden rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring',
        invalid && 'border-destructive',
        '[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
