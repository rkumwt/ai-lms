import type { CourseSeed } from './types';

export const nodejsCourse: CourseSeed = {
  id: 'c-node',
  title: 'Node.js Deep Dive',
  description:
    'How Node.js really works: the event loop, streams, worker threads and building production-ready HTTP services.',
  category: 'Backend',
  tags: ['nodejs', 'javascript', 'backend', 'performance'],
  level: 'intermediate',
  cover: ['#16a34a', '#065f46'],
  createdDaysAgo: 40,
  updatedDaysAgo: 0,
  targetInDays: 30,
  topics: [
    {
      title: 'The Event Loop Explained',
      tags: ['event-loop', 'async'],
      status: 'ready',
      durationSec: 412,
      confidence: 'okay',
      reviewInDays: 0,
      recordedDaysAgo: 12,
      points: [
        'The event loop runs phases in order: timers, pending callbacks, poll, check and close callbacks.',
        'process.nextTick callbacks run before promise microtasks, and both drain between every phase.',
        'Blocking the main thread with CPU work delays every pending callback and request.',
      ],
      qa: [
        ['Which runs first: process.nextTick or a resolved promise callback?', 'process.nextTick'],
        ['In which phase does setImmediate run?', 'The check phase'],
        [
          'What happens if you run a long synchronous loop in a request handler?',
          'All other requests wait until it finishes',
        ],
      ],
      links: [
        {
          title: 'Node.js docs: The event loop',
          url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
        },
      ],
    },
    {
      title: 'Streams and Backpressure',
      tags: ['streams', 'performance'],
      status: 'ready',
      durationSec: 538,
      confidence: 'weak',
      reviewInDays: -2,
      recordedDaysAgo: 9,
      points: [
        'Streams process data in chunks so memory stays flat regardless of file size.',
        'Backpressure happens when the writable side cannot keep up; write() returns false as a signal.',
        'stream.pipeline() wires streams together and forwards errors and cleanup correctly.',
      ],
      qa: [
        [
          'What does writable.write() returning false mean?',
          'The internal buffer is full; wait for drain',
        ],
        ['Which helper should you prefer over .pipe() for error handling?', 'stream.pipeline()'],
        ['Name the four stream types in Node.js.', 'Readable, Writable, Duplex and Transform'],
      ],
    },
    {
      title: 'Worker Threads vs Cluster',
      tags: ['concurrency', 'performance'],
      status: 'ready',
      durationSec: 465,
      confidence: 'strong',
      reviewInDays: 5,
      recordedDaysAgo: 4,
      points: [
        'Cluster forks separate processes that share a server port; each has its own memory.',
        'Worker threads share a process and can transfer or share memory with SharedArrayBuffer.',
        'Use workers for CPU-heavy tasks, cluster or multiple containers for scaling I/O servers.',
      ],
      qa: [
        [
          'Which option lets you share memory between parallel tasks?',
          'Worker threads with SharedArrayBuffer',
        ],
        [
          'What does the cluster module distribute across workers?',
          'Incoming connections on a shared port',
        ],
        [
          'When are worker threads the right tool?',
          'CPU-bound work such as image processing or hashing',
        ],
      ],
    },
    {
      title: 'Error Handling Patterns',
      tags: ['errors', 'express'],
      status: 'processing',
      durationSec: 0,
      recordedDaysAgo: 0,
      points: [
        'Operational errors are expected failures; programmer errors are bugs and should crash fast.',
        'In Express 5, rejected promises from async handlers reach the error middleware automatically.',
        'Centralise error formatting in one error-handling middleware with four arguments.',
      ],
      qa: [
        ['How many parameters does Express error middleware take?', 'Four: err, req, res, next'],
        [
          'Should you keep running after an uncaughtException?',
          'No, log it and restart the process',
        ],
        ['Give an example of an operational error.', 'A database connection timeout'],
      ],
    },
    {
      title: 'Building a REST API with Express',
      tags: ['express', 'api'],
      status: 'draft',
      points: [
        'Group routes by resource with express.Router and keep handlers thin.',
        'Validate input at the edge with a schema library such as Zod.',
        'Return consistent error shapes and proper HTTP status codes.',
      ],
      qa: [
        [
          'Which status code fits a failed validation?',
          '400 Bad Request or 422 Unprocessable Content',
        ],
        ['Where should request validation happen?', 'At the edge, before business logic'],
        ['What does express.Router help with?', 'Grouping routes by resource into modules'],
      ],
    },
    {
      title: 'Profiling and Memory Leaks',
      tags: ['performance', 'debugging'],
      status: 'draft',
      points: [
        'Use --inspect with Chrome DevTools to record CPU profiles and heap snapshots.',
        'Compare two heap snapshots to find objects that keep growing.',
        'Common leaks: unbounded caches, forgotten timers and event listeners.',
      ],
      qa: [
        ['Which flag opens the inspector?', '--inspect'],
        ['How do you find a leak with heap snapshots?', 'Compare snapshots taken over time'],
        ['Name a common source of memory leaks.', 'Event listeners that are never removed'],
      ],
    },
  ],
};
