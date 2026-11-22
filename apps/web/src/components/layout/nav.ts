import { BookOpen, RefreshCcw, Settings, Sparkles, type LucideIcon } from 'lucide-react';

export interface NavLinkItem {
  kind: 'link';
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: 'due';
}

export interface NavActionItem {
  kind: 'action';
  label: string;
  action: 'askAi';
  icon: LucideIcon;
}

export type NavItem = NavLinkItem | NavActionItem;

export const NAV_ITEMS: NavItem[] = [
  { kind: 'link', label: 'Courses', to: '/courses', icon: BookOpen },
  { kind: 'link', label: 'Revision', to: '/revision', icon: RefreshCcw, badge: 'due' },
  { kind: 'action', label: 'Ask AI', action: 'askAi', icon: Sparkles },
  { kind: 'link', label: 'Settings', to: '/settings', icon: Settings },
];
