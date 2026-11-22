import type { Editor } from '@tiptap/react';
import { Link2, Unlink } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const active = editor.isActive('link');

  const onOpenChange = (next: boolean) => {
    if (next) setUrl((editor.getAttributes('link').href as string | undefined) ?? '');
    setOpen(next);
  };

  const apply = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange('link');
    if (href) chain.setLink({ href: /^https?:\/\//.test(href) ? href : `https://${href}` }).run();
    else chain.unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('size-8 p-0', active && 'bg-accent')}
          aria-label="Link"
          aria-pressed={active}
          title="Link"
        >
          <Link2 className="size-4" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <form onSubmit={apply} className="space-y-2">
          <Label htmlFor="notes-link-url">Link URL</Label>
          <Input
            id="notes-link-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
          />
          <div className="flex justify-end gap-2">
            {active && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run();
                  setOpen(false);
                }}
              >
                <Unlink aria-hidden /> Remove
              </Button>
            )}
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
