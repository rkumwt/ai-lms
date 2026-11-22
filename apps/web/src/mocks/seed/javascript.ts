import type { CourseSeed } from './types';

export const javascriptCourse: CourseSeed = {
  id: 'c-js',
  title: 'JavaScript Fundamentals Refresh',
  description:
    'A quick refresh of the language features that come up in every interview: closures, this, prototypes and async.',
  category: 'Languages',
  tags: ['javascript', 'interview', 'fundamentals'],
  level: 'beginner',
  cover: ['#eab308', '#a16207'],
  createdDaysAgo: 90,
  updatedDaysAgo: 15,
  targetInDays: null,
  topics: [
    {
      title: 'Closures and Scope',
      tags: ['closures', 'scope'],
      status: 'ready',
      durationSec: 298,
      confidence: 'strong',
      reviewInDays: 12,
      recordedDaysAgo: 60,
      points: [
        'A closure is a function bundled with references to the variables of its outer scope.',
        'let and const are block-scoped; var is function-scoped and hoisted.',
        'Closures power private state, factories and memoised functions.',
      ],
      qa: [
        ['What does a closure capture?', 'References to variables in its outer scope'],
        ['Which declaration is function-scoped?', 'var'],
        ['Name a practical use of closures.', 'Keeping private state in a factory function'],
      ],
    },
    {
      title: 'How "this" Works',
      tags: ['this', 'functions'],
      status: 'ready',
      durationSec: 356,
      confidence: 'weak',
      reviewInDays: -3,
      recordedDaysAgo: 55,
      points: [
        'this is decided by how a function is called, not where it is defined.',
        'Arrow functions do not have their own this; they use the enclosing scope.',
        'call, apply and bind set this explicitly; bind returns a new function.',
      ],
      qa: [
        ['What decides the value of this in a regular function?', 'How the function is called'],
        ['Do arrow functions have their own this?', 'No, they use the enclosing scope'],
        ['Which method returns a new function with a fixed this?', 'bind'],
      ],
    },
    {
      title: 'Prototypes and Classes',
      tags: ['prototypes', 'oop'],
      status: 'ready',
      durationSec: 402,
      confidence: 'okay',
      reviewInDays: 3,
      recordedDaysAgo: 48,
      points: [
        'Objects inherit through the prototype chain, checked from the object upwards.',
        'class syntax is sugar over constructor functions and prototypes.',
        'Methods defined in a class live on the prototype and are shared by instances.',
      ],
      qa: [
        ['Where are class methods stored?', 'On the prototype'],
        ['Is class syntax a new inheritance model?', 'No, it is sugar over prototypes'],
        ['How is a property looked up?', 'Up the prototype chain until found or null'],
      ],
    },
    {
      title: 'Promises and async/await',
      tags: ['async', 'promises'],
      status: 'ready',
      durationSec: 445,
      confidence: 'okay',
      reviewInDays: 0,
      recordedDaysAgo: 40,
      points: [
        'A promise is pending, then settles once as fulfilled or rejected.',
        'Promise.all fails fast; Promise.allSettled waits for every promise.',
        'await pauses the async function only, not the whole thread.',
      ],
      qa: [
        ['Which combinator waits for every promise regardless of failures?', 'Promise.allSettled'],
        ['Can a settled promise change state again?', 'No, it settles only once'],
        ['Does await block the main thread?', 'No, it only pauses the async function'],
      ],
    },
  ],
};
