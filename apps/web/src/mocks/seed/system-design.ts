import type { CourseSeed } from './types';

export const systemDesignCourse: CourseSeed = {
  id: 'c-sd',
  title: 'System Design Interview Prep',
  description:
    'Core building blocks for designing scalable systems: caching, load balancing, databases, queues and consistency.',
  category: 'Architecture',
  tags: ['system-design', 'interview', 'scalability', 'databases'],
  level: 'advanced',
  cover: ['#7c3aed', '#312e81'],
  createdDaysAgo: 55,
  updatedDaysAgo: 2,
  targetInDays: 21,
  topics: [
    {
      title: 'Caching Strategies',
      tags: ['caching', 'redis'],
      status: 'ready',
      durationSec: 496,
      confidence: 'okay',
      reviewInDays: 0,
      recordedDaysAgo: 20,
      points: [
        'Cache-aside loads data into the cache on a miss; the application owns the logic.',
        'Write-through writes to cache and database together; write-back delays the database write.',
        'Pick an eviction policy such as LRU and always set TTLs to bound staleness.',
      ],
      qa: [
        ['In cache-aside, who populates the cache?', 'The application, on a cache miss'],
        ['What is the risk of write-back caching?', 'Data loss if the cache fails before flushing'],
        ['What does LRU evict first?', 'The least recently used entry'],
      ],
    },
    {
      title: 'Load Balancing',
      tags: ['networking', 'scalability'],
      status: 'ready',
      durationSec: 381,
      confidence: 'strong',
      reviewInDays: 6,
      recordedDaysAgo: 18,
      points: [
        'L4 load balancers route by IP and port; L7 balancers can route by path, headers and cookies.',
        'Common algorithms: round robin, least connections and consistent hashing.',
        'Health checks remove unhealthy instances from rotation automatically.',
      ],
      qa: [
        ['Which layer can route based on URL path?', 'Layer 7'],
        [
          'Which algorithm keeps a user on the same server when nodes change?',
          'Consistent hashing',
        ],
        ['What removes failed instances from rotation?', 'Health checks'],
      ],
    },
    {
      title: 'Database Sharding',
      tags: ['databases', 'scalability'],
      status: 'ready',
      durationSec: 602,
      confidence: 'weak',
      reviewInDays: -1,
      recordedDaysAgo: 14,
      points: [
        'Sharding splits data across nodes by a shard key so each node holds a subset.',
        'A bad shard key causes hot spots; choose one with high cardinality and even access.',
        'Cross-shard joins and transactions are expensive, so model data to avoid them.',
      ],
      qa: [
        ['What causes a hot shard?', 'A shard key with uneven access patterns'],
        ['What property should a good shard key have?', 'High cardinality and even distribution'],
        ['Why avoid cross-shard transactions?', 'They need coordination and are slow'],
      ],
    },
    {
      title: 'CAP Theorem and Consistency',
      tags: ['distributed-systems'],
      status: 'ready',
      durationSec: 344,
      confidence: 'okay',
      reviewInDays: 2,
      recordedDaysAgo: 6,
      points: [
        'During a network partition a system must choose between consistency and availability.',
        'Strong consistency means every read sees the latest write; eventual consistency converges later.',
        'Quorum reads and writes (R + W > N) give strong consistency in replicated stores.',
      ],
      qa: [
        ['What does CAP force you to choose during a partition?', 'Consistency or availability'],
        ['When is a quorum system strongly consistent?', 'When R + W > N'],
        ['What does eventual consistency guarantee?', 'Replicas converge if writes stop'],
      ],
    },
    {
      title: 'Message Queues and Event Streaming',
      tags: ['queues', 'kafka'],
      status: 'recorded',
      durationSec: 455,
      recordedDaysAgo: 1,
      points: [
        'Queues decouple producers and consumers and absorb traffic spikes.',
        'Kafka keeps an ordered, replayable log per partition; consumers track offsets.',
        'Design consumers to be idempotent because at-least-once delivery causes duplicates.',
      ],
      qa: [
        ['Why must consumers be idempotent?', 'At-least-once delivery can deliver duplicates'],
        ['Where does Kafka guarantee ordering?', 'Within a single partition'],
        [
          'What benefit do queues give during traffic spikes?',
          'They buffer work so consumers keep a steady pace',
        ],
      ],
    },
    {
      title: 'Designing a URL Shortener',
      tags: ['case-study', 'interview'],
      status: 'draft',
      points: [
        'Generate short codes with base62 encoding of a unique ID or a hash with collision checks.',
        'Reads massively outnumber writes, so cache hot redirects close to users.',
        'Use 301 for permanent redirects, or 302 if you need click analytics on every hit.',
      ],
      qa: [
        ['Which encoding is common for short codes?', 'Base62'],
        ['Why use 302 instead of 301?', 'Browsers do not cache it, so every click is counted'],
        ['Is a URL shortener read-heavy or write-heavy?', 'Read-heavy'],
      ],
    },
  ],
};
