import { Construction } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUiStore } from '@/stores/uiStore';

/** Placeholder; the full recording setup is built in step d. */
export function RecordingSetupDialog() {
  const { open } = useUiStore((s) => s.recordSetup);
  const close = useUiStore((s) => s.closeRecordSetup);
  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record explanation</DialogTitle>
          <DialogDescription>Choose a source and devices.</DialogDescription>
        </DialogHeader>
        <EmptyState icon={Construction} title="Coming in step d" className="border-none py-6" />
      </DialogContent>
    </Dialog>
  );
}
