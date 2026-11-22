import { Circle, Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUiStore } from '@/stores/uiStore';

import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function TopBar() {
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu />
      </Button>

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted sm:max-w-sm"
        aria-label="Search courses and topics"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="truncate">Search courses and topics…</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button size="sm" className="gap-2" onClick={() => openRecordSetup(null)}>
          <Circle className="fill-current text-red-400" aria-hidden />
          <span className="hidden sm:inline">Record</span>
          <span className="sr-only sm:hidden">Record</span>
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
