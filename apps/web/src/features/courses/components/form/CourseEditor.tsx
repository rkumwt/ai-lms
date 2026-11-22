import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { CourseInput, CourseSummary } from '@/types';

import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses';

import { AiOutlinePanel } from './AiOutlinePanel';
import { CourseFormFields } from './CourseFormFields';
import {
  EMPTY_COURSE,
  courseSchema,
  type CourseFormValues,
  type OutlineItem,
} from './courseSchema';

export const COURSE_FORM_ID = 'course-form';

function toValues(course: CourseSummary): CourseFormValues {
  const { title, description, categoryId, tags, coverUrl, level, targetDate } = course;
  return { title, description, categoryId, tags, coverUrl, level, targetDate };
}

export function CourseEditor({ course }: { course?: CourseSummary }) {
  const navigate = useNavigate();
  const isEdit = Boolean(course);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ? toValues(course) : EMPTY_COURSE,
  });
  const [title = '', description = ''] = useWatch({
    control: form.control,
    name: ['title', 'description'],
  });
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const create = useCreateCourse();
  const update = useUpdateCourse(course?.id ?? '');
  const pending = create.isPending || update.isPending;

  const onSubmit = (values: CourseFormValues) => {
    const input: CourseInput = {
      ...values,
      outline: outline.filter((i) => i.checked && i.title.trim()).map((i) => i.title.trim()),
    };
    const mutation = isEdit ? update : create;
    mutation.mutate(input, {
      onSuccess: (saved) => {
        const added = input.outline?.length ?? 0;
        toast.success(isEdit ? 'Course updated' : 'Course created', {
          description: added ? `${added} topics added from the outline.` : saved.title,
        });
        navigate(`/courses/${saved.id}`);
      },
      onError: (e) => toast.error('Could not save the course', { description: e.message }),
    });
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Form {...form}>
        <form id={COURSE_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <CourseFormFields form={form} />
            </CardContent>
          </Card>
          <div className="mt-4 flex justify-end gap-2 lg:hidden">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {isEdit ? 'Save changes' : 'Create course'}
            </Button>
          </div>
        </form>
      </Form>
      <aside aria-label="AI outline">
        <AiOutlinePanel
          title={title}
          description={description}
          items={outline}
          onItemsChange={setOutline}
          isEdit={isEdit}
        />
      </aside>
    </div>
  );
}
