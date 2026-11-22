import type { CourseSeed } from './types';

export const reactCourse: CourseSeed = {
  id: 'c-react',
  title: 'React Patterns and Performance',
  description:
    'Modern React patterns: hooks, state management, rendering behaviour and performance tuning.',
  category: 'Frontend',
  tags: ['react', 'frontend', 'performance', 'hooks'],
  level: 'intermediate',
  cover: ['#0ea5e9', '#1e3a8a'],
  createdDaysAgo: 3,
  updatedDaysAgo: 3,
  targetInDays: 60,
  topics: [
    {
      title: 'Rendering and Reconciliation',
      tags: ['rendering'],
      status: 'draft',
      points: [
        'A component re-renders when its state changes or its parent re-renders.',
        'Keys tell React which list items are the same between renders.',
        'Rendering is computing the UI; committing is applying changes to the DOM.',
      ],
      qa: [
        ['Why do list items need stable keys?', 'So React can match items between renders'],
        ['Does a parent re-render re-render children?', 'Yes, unless they are memoised'],
        ['What is the commit phase?', 'Applying computed changes to the DOM'],
      ],
    },
    {
      title: 'useEffect Done Right',
      tags: ['hooks'],
      status: 'draft',
      points: [
        'Effects synchronise with external systems; they are not for deriving state.',
        'Return a cleanup function to undo subscriptions and timers.',
        'Every reactive value used inside the effect belongs in the dependency array.',
      ],
      qa: [
        ['What should effects be used for?', 'Synchronising with external systems'],
        ['When does the cleanup function run?', 'Before the next effect and on unmount'],
        ['What belongs in the dependency array?', 'Every reactive value the effect reads'],
      ],
    },
    {
      title: 'Memoisation: memo, useMemo, useCallback',
      tags: ['performance', 'hooks'],
      status: 'draft',
      points: [
        'React.memo skips re-rendering when props are shallowly equal.',
        'useMemo caches a computed value; useCallback caches a function identity.',
        'Measure with the Profiler before adding memoisation everywhere.',
      ],
      qa: [
        ['What does React.memo compare?', 'Props, shallowly'],
        ['What does useCallback cache?', 'A function identity'],
        ['What should you do before memoising?', 'Measure with the React Profiler'],
      ],
    },
  ],
};
