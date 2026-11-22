import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUiStore } from '@/stores/uiStore';

import { Logo } from './Logo';
import { SidebarNav } from './SidebarNav';

interface AppSidebarProps {
  dueCount?: number;
}

/** Fixed sidebar on desktop, Sheet on mobile. */
export function AppSidebar({ dueCount }: AppSidebarProps) {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-3 py-5 md:flex">
        <div className="px-2">
          <Logo />
        </div>
        <SidebarNav dueCount={dueCount} />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-4">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Main navigation</SheetDescription>
            <Logo />
          </SheetHeader>
          <SidebarNav dueCount={dueCount} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
