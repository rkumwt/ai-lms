import { ArrowLeft, Circle, Pencil, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { TopicStatusBadge } from '@/components/StatusBadge';
import { TagList } from '@/components/TagList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryView } from '@/features/ai/components/player/SummaryView';
import { TranscriptPanel } from '@/features/ai/components/player/TranscriptPanel';
import { VideoPlayer, type VideoPlayerHandle } from '@/features/ai/components/player/VideoPlayer';
import { FlashcardDeck } from '@/features/ai/components/study/FlashcardDeck';
import { QuizRunner } from '@/features/ai/components/study/QuizRunner';
import { useTopicAi } from '@/features/ai/hooks/useTopicAi';
import { ConfidenceButtons } from '@/features/topics/components/ConfidenceButtons';
import { TopicNotesView } from '@/features/topics/components/TopicNotesView';
import { useTopic, useTopicVideo } from '@/features/topics/hooks/useTopics';
import { useUiStore } from '@/stores/uiStore';

export default function TopicPlayerPage() {
  const { topicId = '' } = useParams();
  const [params] = useSearchParams();
  const startAt = Number(params.get('t')) || undefined;
  const topic = useTopic(topicId);
  const video = useTopicVideo(topicId);
  const ai = useTopicAi(topicId);
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);
  const player = useRef<VideoPlayerHandle>(null);
  const [time, setTime] = useState(startAt ?? 0);

  const error = topic.error ?? video.error ?? ai.error;
  if (error)
    return (
      <ErrorState
        title="Could not load this topic"
        error={error}
        onRetry={() => void Promise.all([topic.refetch(), video.refetch(), ai.refetch()])}
      />
    );
  if (topic.isPending || video.isPending || ai.isPending) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading topic">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="h-full min-h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const t = topic.data;
  if (!t) return null;
  const header = (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={`/courses/${t.courseId}`}>
          <ArrowLeft aria-hidden /> {t.courseTitle}
        </Link>
      </Button>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Topic {t.order} <TopicStatusBadge status={t.status} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
          <TagList tags={t.tags} max={5} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/topics/${t.id}/edit`}>
              <Pencil aria-hidden /> Edit notes
            </Link>
          </Button>
          <Button variant="outline" onClick={() => openRecordSetup(t.id)}>
            <Circle className="fill-red-500 text-red-500" aria-hidden /> Re-record
          </Button>
        </div>
      </div>
    </div>
  );

  if (!video.data || !ai.data) {
    const processing =
      t.status === 'processing' || t.status === 'recorded' || t.status === 'failed';
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={Sparkles}
          title={processing ? 'AI results aren’t ready yet' : 'Nothing recorded yet'}
          description={
            processing
              ? 'Check the processing status on the review page.'
              : 'Record an explanation and AI will create a transcript, summary, flashcards and a quiz.'
          }
          action={
            processing ? (
              <Button asChild>
                <Link to={`/topics/${t.id}/review`}>Open review</Link>
              </Button>
            ) : (
              <Button onClick={() => openRecordSetup(t.id)}>
                <Circle className="fill-red-400 text-red-400" aria-hidden /> Record explanation
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <VideoPlayer
            ref={player}
            src={video.data.url}
            title={`Recording: ${t.title}`}
            initialTime={startAt}
            onTimeUpdate={setTime}
          />
          <Card className="p-4 shadow-soft">
            <ConfidenceButtons topic={t} />
          </Card>
        </div>
        <TranscriptPanel
          lines={ai.data.transcript}
          currentTime={time}
          onSeek={(s) => player.current?.seek(s)}
          className="h-[420px] lg:h-auto lg:max-h-[640px]"
        />
      </div>
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <SummaryView summary={ai.data.summary} keyPoints={ai.data.keyPoints} />
        </TabsContent>
        <TabsContent value="flashcards" className="mt-4">
          <FlashcardDeck cards={ai.data.flashcards} />
        </TabsContent>
        <TabsContent value="quiz" className="mt-4">
          <QuizRunner questions={ai.data.quiz} />
        </TabsContent>
        <TabsContent value="notes" className="mt-4">
          <TopicNotesView topic={t} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
