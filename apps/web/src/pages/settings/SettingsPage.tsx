import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { useSettings } from '@/features/settings/hooks/useSettings';

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'recording', label: 'Recording' },
  { id: 'ai', label: 'AI preferences' },
  { id: 'appearance', label: 'Appearance' },
];

export default function SettingsPage() {
  const settings = useSettings();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Profile, recording defaults, AI preferences and theme."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="hidden lg:sticky lg:top-20 lg:block">
          <ul className="space-y-1 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 max-w-3xl">
          {settings.isPending && (
            <div className="space-y-6" aria-busy="true" aria-label="Loading settings">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))}
            </div>
          )}
          {settings.error && (
            <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />
          )}
          {settings.data && <SettingsForm settings={settings.data} />}
        </div>
      </div>
    </div>
  );
}
