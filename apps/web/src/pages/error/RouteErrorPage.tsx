import { AlertTriangle } from 'lucide-react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { NotFoundPage } from '../not-found/NotFoundPage';

function describe(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export function RouteErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{describe(error)}</p>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button asChild>
          <Link to="/courses">Go to courses</Link>
        </Button>
      </div>
    </div>
  );
}
