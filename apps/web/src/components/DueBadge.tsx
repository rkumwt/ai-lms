import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function DueBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <Badge variant="warning" className={cn('font-semibold', className)}>
      <Clock aria-hidden />
      {count} due
    </Badge>
  );
}
