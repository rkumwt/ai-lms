import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link
      to="/courses"
      className="flex items-center gap-2 rounded-md font-semibold tracking-tight"
      aria-label="Learning Video Platform home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <Play className="size-4 fill-current" aria-hidden />
      </span>
      <span className="text-sm leading-tight">
        Learning
        <br />
        <span className="text-muted-foreground">Video Platform</span>
      </span>
    </Link>
  );
}
