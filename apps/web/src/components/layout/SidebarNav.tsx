import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/uiStore';

import { NAV_ITEMS, type NavItem } from './nav';

const itemClass =
  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

interface SidebarNavProps {
  dueCount?: number;
  onNavigate?: () => void;
}

export function SidebarNav({ dueCount, onNavigate }: SidebarNavProps) {
  const setAskAiOpen = useUiStore((s) => s.setAskAiOpen);

  const renderBadge = (item: NavItem) =>
    item.kind === 'link' && item.badge === 'due' && dueCount ? (
      <span
        className="ml-auto rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-warning"
        aria-label={`${dueCount} topics due today`}
      >
        {dueCount}
      </span>
    ) : null;

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        if (item.kind === 'action') {
          return (
            <button
              key={item.label}
              type="button"
              className={itemClass}
              onClick={() => {
                onNavigate?.();
                setAskAiOpen(true);
              }}
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </button>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(itemClass, isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')
            }
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
            {renderBadge(item)}
          </NavLink>
        );
      })}
    </nav>
  );
}
