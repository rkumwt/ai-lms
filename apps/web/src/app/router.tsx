import type { ComponentType } from 'react';
import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';
import { FocusLayout } from '@/layouts/FocusLayout';
import { RouteErrorPage } from '@/pages/error/RouteErrorPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

type PageModule = { default: ComponentType };

/** Lazy-load a page module that default-exports its component. */
const page = (load: () => Promise<PageModule>): RouteObject['lazy'] => {
  return async () => ({ Component: (await load()).default });
};

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <Navigate to="/courses" replace /> },
          { path: 'courses', lazy: page(() => import('@/pages/courses/CoursesHomePage')) },
          { path: 'courses/new', lazy: page(() => import('@/pages/course-form/CourseFormPage')) },
          {
            path: 'courses/:courseId',
            lazy: page(() => import('@/pages/course-detail/CourseDetailPage')),
          },
          {
            path: 'courses/:courseId/edit',
            lazy: page(() => import('@/pages/course-form/CourseFormPage')),
          },
          {
            path: 'courses/:courseId/topics/new',
            lazy: page(() => import('@/pages/topic-form/TopicFormPage')),
          },
          {
            path: 'topics/:topicId',
            lazy: page(() => import('@/pages/topic-player/TopicPlayerPage')),
          },
          {
            path: 'topics/:topicId/edit',
            lazy: page(() => import('@/pages/topic-form/TopicFormPage')),
          },
          { path: 'topics/:topicId/review', lazy: page(() => import('@/pages/review/ReviewPage')) },
          { path: 'revision', lazy: page(() => import('@/pages/revision-hub/RevisionHubPage')) },
          {
            path: 'revision/session',
            lazy: page(() => import('@/pages/study-session/StudySessionPage')),
          },
          { path: 'settings', lazy: page(() => import('@/pages/settings/SettingsPage')) },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    element: <FocusLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: 'topics/:topicId/record',
        lazy: page(() => import('@/pages/recording-studio/RecordingStudioPage')),
      },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
