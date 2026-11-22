import {
  CheckCircle2,
  Circle,
  FilePen,
  Loader2,
  PlayCircle,
  Video,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CourseStatus, TopicStatus } from '@/types';

interface StatusMeta {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
  icon: LucideIcon;
  spin?: boolean;
}

const TOPIC_STATUS_META: Record<TopicStatus, StatusMeta> = {
  draft: { label: 'Draft', variant: 'secondary', icon: FilePen },
  recorded: { label: 'Recorded', variant: 'info', icon: Video },
  processing: { label: 'Processing', variant: 'info', icon: Loader2, spin: true },
  ready: { label: 'Ready', variant: 'success', icon: CheckCircle2 },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

const COURSE_STATUS_META: Record<CourseStatus, StatusMeta> = {
  not_started: { label: 'Not started', variant: 'secondary', icon: Circle },
  in_progress: { label: 'In progress', variant: 'info', icon: PlayCircle },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
};

function MetaBadge({ meta, className }: { meta: StatusMeta; className?: string }) {
  const Icon = meta.icon;
  return (
    <Badge variant={meta.variant} className={className}>
      <Icon className={cn(meta.spin && 'animate-spin')} aria-hidden />
      {meta.label}
    </Badge>
  );
}

export function TopicStatusBadge({
  status,
  className,
}: {
  status: TopicStatus;
  className?: string;
}) {
  return <MetaBadge meta={TOPIC_STATUS_META[status]} className={className} />;
}

export function CourseStatusBadge({
  status,
  className,
}: {
  status: CourseStatus;
  className?: string;
}) {
  return <MetaBadge meta={COURSE_STATUS_META[status]} className={className} />;
}
