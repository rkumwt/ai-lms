import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TagListProps {
  tags: string[];
  max?: number;
  className?: string;
}

export function TagList({ tags, max = 3, className }: TagListProps) {
  if (!tags.length) return null;
  const visible = tags.slice(0, max);
  const hidden = tags.slice(max);
  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)} aria-label="Tags">
      {visible.map((tag) => (
        <li key={tag}>
          <Badge variant="outline" className="font-normal text-muted-foreground">
            #{tag}
          </Badge>
        </li>
      ))}
      {hidden.length > 0 && (
        <li>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="relative z-10 rounded-md"
                aria-label={`${hidden.length} more tags: ${hidden.join(', ')}`}
              >
                <Badge variant="secondary" className="font-normal">
                  +{hidden.length}
                </Badge>
              </button>
            </TooltipTrigger>
            <TooltipContent>{hidden.map((t) => `#${t}`).join('  ')}</TooltipContent>
          </Tooltip>
        </li>
      )}
    </ul>
  );
}
