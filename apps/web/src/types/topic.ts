export type TopicStatus = 'draft' | 'recorded' | 'processing' | 'ready' | 'failed';
export type Confidence = 'weak' | 'okay' | 'strong';

export interface ReadingLink {
  id: string;
  title: string;
  url: string;
}

export interface Topic {
  id: string;
  courseId: string;
  /** 1-based position within the course */
  order: number;
  title: string;
  tags: string[];
  notesHtml: string;
  links: ReadingLink[];
  status: TopicStatus;
  durationSec: number;
  confidence: Confidence | null;
  /** ISO datetime */
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
  videoId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopicWithCourse extends Topic {
  courseTitle: string;
}

export interface TopicInput {
  title: string;
  tags: string[];
  notesHtml: string;
  links: ReadingLink[];
}

export interface Video {
  id: string;
  topicId: string;
  url: string;
  durationSec: number;
  createdAt: string;
}
