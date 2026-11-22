import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CourseView = 'grid' | 'list';

interface PreferencesState {
  courseView: CourseView;
  setCourseView: (view: CourseView) => void;
}

/** Per-device UI preferences (persisted in localStorage when available). */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      courseView: 'grid',
      setCourseView: (courseView) => set({ courseView }),
    }),
    {
      name: 'lvp:preferences',
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          return sessionStorage;
        }
      }),
    },
  ),
);
