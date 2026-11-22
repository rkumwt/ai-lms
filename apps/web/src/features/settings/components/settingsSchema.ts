import { z } from 'zod';

export const settingsSchema = z.object({
  profile: z.object({
    name: z.string().trim().min(1, 'Enter your name').max(60),
    email: z.string().trim().email('Enter a valid email'),
    bio: z.string().max(200, 'Keep it under 200 characters'),
  }),
  recording: z.object({
    source: z.enum(['screen', 'camera', 'screen_camera', 'whiteboard']),
    countdown: z.boolean(),
    teleprompter: z.boolean(),
    quality: z.enum(['720p', '1080p']),
  }),
  ai: z.object({
    summaryLength: z.enum(['short', 'medium', 'long']),
    quizDifficulty: z.enum(['easy', 'medium', 'hard']),
    flashcardCount: z.number().int().min(3).max(15),
  }),
  theme: z.enum(['light', 'dark', 'system']),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
