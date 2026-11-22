import { create } from 'zustand';

import type { RecordingConfig, RecordingResult } from '@/features/recording/types';

interface RecordingState {
  config: RecordingConfig | null;
  /** Latest local recording; the Blob lives only in this tab's memory. */
  result: RecordingResult | null;
  setConfig: (config: RecordingConfig) => void;
  setResult: (result: RecordingResult) => void;
  markUploaded: (blobUrl: string) => void;
  clearResult: () => void;
}

export const useRecordingStore = create<RecordingState>()((set, get) => ({
  config: null,
  result: null,
  setConfig: (config) => set({ config }),
  setResult: (result) => {
    const previous = get().result;
    if (previous && previous.blobUrl !== result.blobUrl) URL.revokeObjectURL(previous.blobUrl);
    set({ result });
  },
  markUploaded: (blobUrl) => {
    const current = get().result;
    if (current?.blobUrl === blobUrl) set({ result: { ...current, uploaded: true } });
  },
  clearResult: () => {
    const previous = get().result;
    if (previous) URL.revokeObjectURL(previous.blobUrl);
    set({ result: null });
  },
}));
