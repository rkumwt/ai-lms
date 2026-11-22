import type { TopicWithCourse } from './topic';

export interface DueTopic extends TopicWithCourse {
  estimatedMinutes: number;
  overdueDays: number;
}

export interface DueQueue {
  items: DueTopic[];
  totalMinutes: number;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  topicId: string;
  topicTitle: string;
  score: number;
  total: number;
  takenAt: string;
}

export interface WeakArea {
  topicId: string;
  topicTitle: string;
  courseTitle: string;
  averageScore: number;
}

export interface MonthlyRecap {
  /** yyyy-MM */
  month: string;
  topicsRecorded: number;
  reviewsDone: number;
  minutesRecorded: number;
  averageScore: number;
  weakAreas: WeakArea[];
  byCourse: { courseId: string; courseTitle: string; topics: number }[];
}

export interface SessionResultInput {
  topicId: string;
  score: number;
  total: number;
}
