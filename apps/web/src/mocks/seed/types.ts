import type { Confidence, CourseLevel, TopicStatus } from '@/types';

export interface TopicSeed {
  title: string;
  tags: string[];
  status: TopicStatus;
  durationSec?: number;
  confidence?: Confidence;
  /** Days from today until next review; 0 = due today, negative = overdue. */
  reviewInDays?: number;
  recordedDaysAgo?: number;
  points: string[];
  qa: [question: string, answer: string][];
  links?: { title: string; url: string }[];
}

export interface CourseSeed {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  level: CourseLevel;
  cover: [from: string, to: string];
  createdDaysAgo: number;
  updatedDaysAgo: number;
  targetInDays: number | null;
  topics: TopicSeed[];
}
