export interface TranscriptLine {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicAi {
  topicId: string;
  transcript: TranscriptLine[];
  summary: string;
  keyPoints: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  updatedAt: string;
}

export type AiSection = 'transcript' | 'summary' | 'flashcards' | 'quiz';

export const PROCESSING_STAGES = [
  'uploading',
  'transcribing',
  'summarizing',
  'flashcards',
  'quiz',
  'ready',
] as const;

export type ProcessingStage = (typeof PROCESSING_STAGES)[number];

export interface ProcessingJob {
  id: string;
  topicId: string;
  stage: ProcessingStage | 'failed';
  /** Stage that failed, when stage === 'failed' */
  failedStage: ProcessingStage | null;
  error: string | null;
  /** 0–100 overall progress */
  progress: number;
  attempt: number;
  startedAt: string;
}

export interface UploadRecordingInput {
  topicId: string;
  /** Local object URL of the recorded Blob */
  blobUrl: string;
  durationSec: number;
}

export interface OutlineSuggestionInput {
  title: string;
  description: string;
}

export interface AskAiSource {
  courseId: string;
  courseTitle: string;
  topicId: string;
  topicTitle: string;
  timestampSec: number;
  snippet: string;
}

export interface AskAiAnswer {
  id: string;
  question: string;
  answer: string;
  sources: AskAiSource[];
}
