import { create } from 'zustand';

interface UiState {
  mobileNavOpen: boolean;
  commandOpen: boolean;
  askAiOpen: boolean;
  recordSetup: { open: boolean; topicId: string | null };
  setMobileNavOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
  setAskAiOpen: (open: boolean) => void;
  openRecordSetup: (topicId?: string | null) => void;
  closeRecordSetup: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  mobileNavOpen: false,
  commandOpen: false,
  askAiOpen: false,
  recordSetup: { open: false, topicId: null },
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  setAskAiOpen: (askAiOpen) => set({ askAiOpen }),
  openRecordSetup: (topicId = null) => set({ recordSetup: { open: true, topicId } }),
  closeRecordSetup: () => set((s) => ({ recordSetup: { ...s.recordSetup, open: false } })),
}));
