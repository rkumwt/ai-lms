import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';

import { LinkButton } from './LinkButton';

interface ToolItem {
  label: string;
  icon: LucideIcon;
  active: (e: Editor) => boolean;
  run: (e: Editor) => void;
}

const FORMAT: ToolItem[] = [
  {
    label: 'Bold',
    icon: Bold,
    active: (e) => e.isActive('bold'),
    run: (e) => e.chain().focus().toggleBold().run(),
  },
  {
    label: 'Italic',
    icon: Italic,
    active: (e) => e.isActive('italic'),
    run: (e) => e.chain().focus().toggleItalic().run(),
  },
  {
    label: 'Underline',
    icon: Underline,
    active: (e) => e.isActive('underline'),
    run: (e) => e.chain().focus().toggleUnderline().run(),
  },
  {
    label: 'Strikethrough',
    icon: Strikethrough,
    active: (e) => e.isActive('strike'),
    run: (e) => e.chain().focus().toggleStrike().run(),
  },
];

const BLOCKS: ToolItem[] = [
  {
    label: 'Heading',
    icon: Heading2,
    active: (e) => e.isActive('heading', { level: 2 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Subheading',
    icon: Heading3,
    active: (e) => e.isActive('heading', { level: 3 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: 'Bullet list',
    icon: List,
    active: (e) => e.isActive('bulletList'),
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Numbered list',
    icon: ListOrdered,
    active: (e) => e.isActive('orderedList'),
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    label: 'Quote',
    icon: Quote,
    active: (e) => e.isActive('blockquote'),
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    label: 'Code block',
    icon: Code2,
    active: (e) => e.isActive('codeBlock'),
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
];

function ToolGroup({
  editor,
  items,
  state,
}: {
  editor: Editor;
  items: ToolItem[];
  state: Record<string, boolean>;
}) {
  return (
    <>
      {items.map((item) => (
        <Toggle
          key={item.label}
          size="sm"
          pressed={state[item.label] ?? false}
          onPressedChange={() => item.run(editor)}
          aria-label={item.label}
          title={item.label}
          className="size-8 p-0"
        >
          <item.icon className="size-4" aria-hidden />
        </Toggle>
      ))}
    </>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const entries = [...FORMAT, ...BLOCKS].map((item) => [item.label, item.active(e)] as const);
      return {
        ...Object.fromEntries(entries),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      } as Record<string, boolean>;
    },
  });

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1"
    >
      <ToolGroup editor={editor} items={FORMAT} state={state} />
      <LinkButton editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolGroup editor={editor} items={BLOCKS} state={state} />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={false}
        disabled={!state.canUndo}
        onPressedChange={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        title="Undo"
      >
        <Undo2 className="size-4" aria-hidden />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={false}
        disabled={!state.canRedo}
        onPressedChange={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
        title="Redo"
      >
        <Redo2 className="size-4" aria-hidden />
      </Toggle>
    </div>
  );
}
