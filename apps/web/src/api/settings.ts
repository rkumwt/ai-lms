import { db } from '@/mocks/db';
import type { Settings } from '@/types';

import { mockRequest } from './client';

export type SettingsPatch = {
  [K in keyof Settings]?: Settings[K] extends object ? Partial<Settings[K]> : Settings[K];
};

export const getSettings = () => mockRequest(() => db.settings);

export const updateSettings = (patch: SettingsPatch) =>
  mockRequest(() => {
    const current = db.settings;
    db.settings = {
      profile: { ...current.profile, ...patch.profile },
      recording: { ...current.recording, ...patch.recording },
      ai: { ...current.ai, ...patch.ai },
      theme: patch.theme ?? current.theme,
    };
    return db.settings;
  });
