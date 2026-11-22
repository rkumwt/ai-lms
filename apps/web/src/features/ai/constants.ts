import type { ProcessingStage } from '@/types';

export const STAGE_META: Record<ProcessingStage, { label: string; description: string }> = {
  uploading: { label: 'Upload', description: 'Uploading your recording' },
  transcribing: { label: 'Transcript', description: 'Transcribing what you said' },
  summarizing: { label: 'Summary', description: 'Writing a summary and key points' },
  flashcards: { label: 'Flashcards', description: 'Creating flashcards' },
  quiz: { label: 'Quiz', description: 'Generating quiz questions' },
  ready: { label: 'Ready', description: 'Everything is ready to review' },
};
