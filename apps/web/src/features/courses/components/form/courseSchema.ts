import { z } from 'zod';

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(80, 'Keep the title under 80 characters'),
  description: z.string().trim().max(500, 'Keep the description under 500 characters'),
  categoryId: z.string().min(1, 'Choose or create a category'),
  tags: z.array(z.string()).max(10, 'Use at most 10 tags'),
  coverUrl: z.string().nullable(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  targetDate: z.string().nullable(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const EMPTY_COURSE: CourseFormValues = {
  title: '',
  description: '',
  categoryId: '',
  tags: [],
  coverUrl: null,
  level: 'beginner',
  targetDate: null,
};

export interface OutlineItem {
  id: string;
  title: string;
  checked: boolean;
}
