import { Construction } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';

/** Temporary placeholder used while pages are being built step by step. */
export function ComingSoon({ title, step }: { title: string; step: string }) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title="Under construction"
        description={`This page is built in step ${step}.`}
      />
    </div>
  );
}
