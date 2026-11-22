export type RecordingSource = 'screen' | 'camera' | 'screen_camera' | 'whiteboard';
export type RecordingQuality = '720p' | '1080p';
export type SummaryLength = 'short' | 'medium' | 'long';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface Settings {
  profile: { name: string; email: string; bio: string };
  recording: {
    source: RecordingSource;
    countdown: boolean;
    teleprompter: boolean;
    quality: RecordingQuality;
  };
  ai: {
    summaryLength: SummaryLength;
    quizDifficulty: QuizDifficulty;
    flashcardCount: number;
  };
  theme: ThemePreference;
}
