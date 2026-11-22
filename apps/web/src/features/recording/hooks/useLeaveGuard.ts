import { useCallback, useEffect, useRef } from 'react';
import { useBlocker, type BlockerFunction } from 'react-router-dom';

/**
 * Blocks in-app navigation and tab closing while `active` is true.
 * Call `allow()` right before an intentional navigation (e.g. after saving).
 */
export function useLeaveGuard(active: boolean) {
  const activeRef = useRef(active);
  activeRef.current = active;
  const allowed = useRef(false);

  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) =>
        activeRef.current && !allowed.current && currentLocation.pathname !== nextLocation.pathname,
      [],
    ),
  );

  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);

  return {
    blocker,
    allow: () => {
      allowed.current = true;
    },
  };
}
