import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function CourseProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Progress
        value={value}
        className={cn('h-1.5', value === 100 && '[&>div]:bg-success')}
        aria-label={`Course progress ${value}%`}
      />
      <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}
