import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/** Tiptap editor for topic notes. Calls `onChange` with HTML on every edit. */
export function useNotesEditor(initialHtml: string, onChange: (html: string) => void) {
  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Placeholder.configure({
        placeholder: 'Write what you want to explain: key ideas, examples, gotchas…',
      }),
    ],
    content: initialHtml,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: 'notes-content min-h-[240px] px-4 py-3 outline-none',
        'aria-label': 'Topic notes',
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });
}
