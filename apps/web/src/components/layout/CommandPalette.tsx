import {
  BookOpen,
  FileVideo,
  Loader2,
  Moon,
  Plus,
  RefreshCcw,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useGlobalSearch } from '@/features/courses/hooks/useGlobalSearch';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useModHotkey } from '@/hooks/useHotkey';
import { useUiStore } from '@/stores/uiStore';

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const toggle = useUiStore((s) => s.toggleCommand);
  const setAskAiOpen = useUiStore((s) => s.setAskAiOpen);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 200);
  const search = useGlobalSearch(debounced);

  useModHotkey('k', toggle);

  const run = (fn: () => void) => {
    setOpen(false);
    setQuery('');
    fn();
  };

  const results = search.data ?? [];
  const courses = results.filter((r) => r.type === 'course');
  const topics = results.filter((r) => r.type === 'topic');
  const searching = debounced.trim().length >= 2 && search.isFetching;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
      title="Search"
      description="Search courses and topics, or run an action."
    >
      <CommandInput
        placeholder="Search courses, topics or actions…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Searching…
            </span>
          ) : (
            'No results found.'
          )}
        </CommandEmpty>

        {courses.length > 0 && (
          <CommandGroup heading="Courses">
            {courses.map((r) => (
              <CommandItem
                key={r.id}
                value={`course-${r.id}`}
                keywords={[query]}
                onSelect={() => run(() => navigate(r.href))}
              >
                <BookOpen />
                <span className="truncate">{r.title}</span>
                <span className="ml-auto truncate text-xs text-muted-foreground">{r.subtitle}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {topics.length > 0 && (
          <CommandGroup heading="Topics">
            {topics.map((r) => (
              <CommandItem
                key={r.id}
                value={`topic-${r.id}`}
                keywords={[query]}
                onSelect={() => run(() => navigate(r.href))}
              >
                <FileVideo />
                <span className="truncate">{r.title}</span>
                <span className="ml-auto truncate text-xs text-muted-foreground">{r.subtitle}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => run(() => navigate('/courses'))}>
            <BookOpen /> Courses
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/revision'))}>
            <RefreshCcw /> Revision
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/settings'))}>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => navigate('/courses/new'))}>
            <Plus /> New course
          </CommandItem>
          <CommandItem onSelect={() => run(() => setAskAiOpen(true))}>
            <Sparkles /> Ask AI
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}
          >
            {resolvedTheme === 'dark' ? <Sun /> : <Moon />} Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
