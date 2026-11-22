import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        className="w-full max-w-lg border-none"
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or was moved."
        action={
          <Button asChild>
            <Link to="/courses">Back to courses</Link>
          </Button>
        }
      />
    </div>
  );
}
