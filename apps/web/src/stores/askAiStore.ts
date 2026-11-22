import { create } from 'zustand';

import type { AskAiSource } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources: AskAiSource[];
  status: 'pending' | 'typing' | 'done' | 'error';
}

interface AskAiState {
  messages: ChatMessage[];
  add: (message: ChatMessage) => void;
  update: (id: string, patch: Partial<ChatMessage>) => void;
  clear: () => void;
}

/** Chat history for the Ask AI sheet (UI state, kept for the browser session). */
export const useAskAiStore = create<AskAiState>()((set) => ({
  messages: [],
  add: (message) => set((s) => ({ messages: [...s.messages, message] })),
  update: (id, patch) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  clear: () => set({ messages: [] }),
}));
