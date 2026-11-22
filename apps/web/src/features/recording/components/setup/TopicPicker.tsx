import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { useTopics } from '@/features/topics/hooks/useTopics';

interface TopicPickerProps {
  courseId: string | null;
  topicId: string | null;
  onCourseChange: (courseId: string) => void;
  onTopicChange: (topicId: string) => void;
}

/** Used when recording is started from the top bar without a topic in context. */
export function TopicPicker({
  courseId,
  topicId,
  onCourseChange,
  onTopicChange,
}: TopicPickerProps) {
  const courses = useCourses({});
  const topics = useTopics(courseId ?? undefined);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="setup-course">Course</Label>
        <Select value={courseId ?? undefined} onValueChange={onCourseChange}>
          <SelectTrigger id="setup-course">
            <SelectValue placeholder={courses.isPending ? 'Loading…' : 'Choose a course'} />
          </SelectTrigger>
          <SelectContent>
            {courses.data?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="setup-topic">Topic</Label>
        <Select value={topicId ?? undefined} onValueChange={onTopicChange} disabled={!courseId}>
          <SelectTrigger id="setup-topic">
            <SelectValue
              placeholder={courseId && topics.isPending ? 'Loading…' : 'Choose a topic'}
            />
          </SelectTrigger>
          <SelectContent>
            {topics.data?.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.order}. {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
