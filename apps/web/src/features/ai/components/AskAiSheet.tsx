import { Sparkles } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUiStore } from '@/stores/uiStore';

export function AskAiSheet() {
  const open = useUiStore((s) => s.askAiOpen);
  const setOpen = useUiStore((s) => s.setAskAiOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden /> Ask AI
          </SheetTitle>
          <SheetDescription>Ask questions across everything you have recorded.</SheetDescription>
        </SheetHeader>
        <EmptyState
          className="mt-6"
          icon={Sparkles}
          title="Chat coming soon"
          description="The Ask AI chat is built in step f."
        />
      </SheetContent>
    </Sheet>
  );
}
