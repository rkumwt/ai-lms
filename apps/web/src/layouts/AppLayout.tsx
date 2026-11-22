import { Outlet, ScrollRestoration } from 'react-router-dom';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { TopBar } from '@/components/layout/TopBar';
import { AskAiSheet } from '@/features/ai/components/AskAiSheet';
import { RecordingSetupDialog } from '@/features/recording/components/RecordingSetupDialog';
import { useDueQueue } from '@/features/revision/hooks/useRevision';

export function AppLayout() {
  const dueQueue = useDueQueue();

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <AppSidebar dueCount={dueQueue.data?.items.length} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main
          id="main"
          className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <AskAiSheet />
      <RecordingSetupDialog />
      <ScrollRestoration />
    </div>
  );
}
