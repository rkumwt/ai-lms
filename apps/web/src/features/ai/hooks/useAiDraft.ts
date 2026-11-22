import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AiSection, TopicAi } from '@/types';

export type AiDraft = Pick<TopicAi, 'transcript' | 'summary' | 'keyPoints' | 'flashcards' | 'quiz'>;

const pick = ({ transcript, summary, keyPoints, flashcards, quiz }: TopicAi): AiDraft => ({
  transcript,
  summary,
  keyPoints,
  flashcards,
  quiz,
});

/** Local, editable copy of AI results with dirty tracking against the server version. */
export function useAiDraft(ai: TopicAi | null | undefined) {
  const [draft, setDraft] = useState<AiDraft | null>(ai ? pick(ai) : null);

  useEffect(() => {
    if (ai && !draft) setDraft(pick(ai));
  }, [ai, draft]);

  const dirty = useMemo(
    () => Boolean(ai && draft && JSON.stringify(draft) !== JSON.stringify(pick(ai))),
    [ai, draft],
  );

  const update = useCallback(<K extends keyof AiDraft>(key: K, value: AiDraft[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }, []);

  /** Replace one section with fresh server data (after Regenerate). */
  const applySection = useCallback((fresh: TopicAi, section: AiSection) => {
    setDraft((d) => {
      if (!d) return pick(fresh);
      if (section === 'summary')
        return { ...d, summary: fresh.summary, keyPoints: fresh.keyPoints };
      return { ...d, [section]: fresh[section] };
    });
  }, []);

  return { draft, dirty, update, applySection };
}
