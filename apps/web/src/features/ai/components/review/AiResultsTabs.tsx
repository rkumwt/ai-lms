import { BookText, ClipboardCheck, Layers, ScrollText } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AiSection, TopicAi } from '@/types';

import type { AiDraft } from '../../hooks/useAiDraft';

import { FlashcardsEditor } from './FlashcardsEditor';
import { QuizEditor } from './QuizEditor';
import { RegenerateButton } from './RegenerateButton';
import { SummaryEditor } from './SummaryEditor';
import { TranscriptEditor } from './TranscriptEditor';

interface AiResultsTabsProps {
  topicId: string;
  draft: AiDraft;
  update: <K extends keyof AiDraft>(key: K, value: AiDraft[K]) => void;
  onRegenerated: (ai: TopicAi, section: AiSection) => void;
}

function Panel({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function AiResultsTabs({ topicId, draft, update, onRegenerated }: AiResultsTabsProps) {
  const regen = (section: AiSection) => (
    <RegenerateButton topicId={topicId} section={section} onRegenerated={onRegenerated} />
  );
  return (
    <Tabs defaultValue="transcript">
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="transcript">
          <ScrollText className="mr-1.5 size-4" aria-hidden />
          Transcript
        </TabsTrigger>
        <TabsTrigger value="summary">
          <BookText className="mr-1.5 size-4" aria-hidden />
          Summary
        </TabsTrigger>
        <TabsTrigger value="flashcards">
          <Layers className="mr-1.5 size-4" aria-hidden />
          Flashcards ({draft.flashcards.length})
        </TabsTrigger>
        <TabsTrigger value="quiz">
          <ClipboardCheck className="mr-1.5 size-4" aria-hidden />
          Quiz ({draft.quiz.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="transcript" className="mt-4">
        <Panel
          title="Transcript"
          hint="Fix any words the AI misheard. Timestamps stay linked to the video."
          action={regen('transcript')}
        >
          <TranscriptEditor value={draft.transcript} onChange={(v) => update('transcript', v)} />
        </Panel>
      </TabsContent>
      <TabsContent value="summary" className="mt-4">
        <Panel
          title="Summary & key points"
          hint="This is what you’ll read first when revising."
          action={regen('summary')}
        >
          <SummaryEditor
            summary={draft.summary}
            keyPoints={draft.keyPoints}
            onSummaryChange={(v) => update('summary', v)}
            onKeyPointsChange={(v) => update('keyPoints', v)}
          />
        </Panel>
      </TabsContent>
      <TabsContent value="flashcards" className="mt-4">
        <Panel
          title="Flashcards"
          hint="Short prompts on the front, answers on the back."
          action={regen('flashcards')}
        >
          <FlashcardsEditor value={draft.flashcards} onChange={(v) => update('flashcards', v)} />
        </Panel>
      </TabsContent>
      <TabsContent value="quiz" className="mt-4">
        <Panel
          title="Quiz"
          hint="Multiple-choice questions used in revision sessions."
          action={regen('quiz')}
        >
          <QuizEditor value={draft.quiz} onChange={(v) => update('quiz', v)} />
        </Panel>
      </TabsContent>
    </Tabs>
  );
}
