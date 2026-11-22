import { awsCourse } from './aws';
import { javascriptCourse } from './javascript';
import { nodejsCourse } from './nodejs';
import { reactCourse } from './react';
import { systemDesignCourse } from './system-design';
import type { CourseSeed } from './types';

export const COURSE_SEEDS: CourseSeed[] = [
  nodejsCourse,
  systemDesignCourse,
  awsCourse,
  javascriptCourse,
  reactCourse,
];

export const CATEGORY_NAMES = ['Backend', 'Frontend', 'Architecture', 'Cloud', 'Languages'];

export type { CourseSeed, TopicSeed } from './types';
