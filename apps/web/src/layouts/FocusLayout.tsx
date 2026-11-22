import { Outlet } from 'react-router-dom';

/** Full-screen layout without sidebar, used by the Recording Studio. */
export function FocusLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Outlet />
    </div>
  );
}
