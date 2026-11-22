import { Badge } from '@/components/ui/badge';
import type { Confidence } from '@/types';

const META: Record<Confidence, { label: string; variant: 'destructive' | 'warning' | 'success' }> =
  {
    weak: { label: 'Weak', variant: 'destructive' },
    okay: { label: 'Okay', variant: 'warning' },
    strong: { label: 'Strong', variant: 'success' },
  };

export function ConfidenceBadge({ confidence }: { confidence: Confidence | null }) {
  if (!confidence) return <span className="text-xs text-muted-foreground">—</span>;
  const meta = META[confidence];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
