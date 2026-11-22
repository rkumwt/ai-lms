import { PageHeader } from '@/components/PageHeader';
import { DueQueueCard } from '@/features/revision/components/DueQueueCard';
import { MonthlyRecapCard } from '@/features/revision/components/MonthlyRecapCard';

export default function RevisionHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Revision"
        description="Short daily sessions keep what you’ve explained from fading."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <DueQueueCard />
        <MonthlyRecapCard />
      </div>
    </div>
  );
}
