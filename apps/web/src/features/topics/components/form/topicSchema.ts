import { z } from 'zod';

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const topicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Keep the title under 120 characters'),
  tags: z.array(z.string()).max(10, 'Use at most 10 tags'),
  notesHtml: z.string(),
  links: z.array(
    z.object({
      id: z.string(),
      title: z.string().trim().min(1, 'Add a title'),
      url: z.string().trim().refine(isHttpUrl, 'Enter a valid http(s) URL'),
    }),
  ),
});

export type TopicFormValues = z.infer<typeof topicSchema>;

export const EMPTY_TOPIC: TopicFormValues = { title: '', tags: [], notesHtml: '', links: [] };
