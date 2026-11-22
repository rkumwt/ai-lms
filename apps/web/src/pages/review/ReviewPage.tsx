import { ArrowLeft, Circle, Sparkles, Video } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { TopicStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from '@/features/ai/components/player/VideoPlayer';
import { ProcessingStepper } from '@/features/ai/components/review/ProcessingStepper';
import { ReviewResults } from '@/features/ai/components/review/ReviewResults';
import { useAutoUpload } from '@/features/ai/hooks/useAutoUpload';
import {
  useProcessingJob,
  useRetryProcessing,
  useStartProcessing,
} from '@/features/ai/hooks/useProcessing';
import { useTopicAi } from '@/features/ai/hooks/useTopicAi';
import { useTopic, useTopicVideo } from '@/features/topics/hooks/useTopics';
import { formatTimestamp } from '@/lib/format';
import { useUiStore } from '@/stores/uiStore';

export default function ReviewPage() {
  const { topicId = '' } = useParams();
  const topic = useTopic(topicId);
  const video = useTopicVideo(topicId);
  const { localRecording, uploading } = useAutoUpload(topicId);
  const job = useProcessingJob(topicId);
  const ai = useTopicAi(topicId);
  const start = useStartProcessing();
  const retry = useRetryProcessing();
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);

  if (topic.error)
    return (
      <ErrorState
        title="Could not load this topic"
        error={topic.error}
        onRetry={() => void topic.refetch()}
      />
    );
  if (topic.isPending || video.isPending) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading review">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  const src = localRecording?.blobUrl ?? video.data?.url ?? null;
  const reRecord = (
    <Button variant="outline" onClick={() => openRecordSetup(topicId)}>
      <Circle className="fill-red-500 text-red-500" aria-hidden /> Re-record
    </Button>
  );
  const processing = job.data && job.data.stage !== 'ready' && job.data.stage !== 'failed';

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={`/courses/${topic.data.courseId}`}>
          <ArrowLeft aria-hidden /> {topic.data.courseTitle}
        </Link>
      </Button>
      <PageHeader
        title="Review & AI processing"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            {topic.data.title} <TopicStatusBadge status={topic.data.status} />
          </span>
        }
        actions={reRecord}
      />

      {!src ? (
        <EmptyState
          icon={Video}
          title="No recording yet"
          description="Record yourself explaining this topic and AI will turn it into revision material."
          action={
            <Button onClick={() => openRecordSetup(topicId)}>
              <Circle className="fill-red-400 text-red-400" aria-hidden /> Record explanation
            </Button>
          }
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <VideoPlayer src={src} title={`Recording of ${topic.data.title}`} />
            <p className="text-xs text-muted-foreground">
              {localRecording
                ? `Local recording · ${formatTimestamp(localRecording.durationSec)} · ${(localRecording.sizeBytes / 1_048_576).toFixed(1)} MB (kept in this browser tab only)`
                : 'Uploaded recording'}
            </p>
          </div>
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" aria-hidden /> AI processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {job.data ? (
                <ProcessingStepper
                  job={job.data}
                  retrying={retry.isPending}
                  onRetry={() =>
                    retry.mutate(topicId, {
                      onError: (e) => toast.error('Retry failed', { description: e.message }),
                    })
                  }
                />
              ) : uploading || job.isPending ? (
                <Skeleton className="h-28" />
              ) : (
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">This recording hasn’t been processed yet.</p>
                  <Button onClick={() => start.mutate(topicId)} disabled={start.isPending}>
                    <Sparkles aria-hidden /> Process with AI
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {ai.data && !processing ? (
        <ReviewResults key={`${ai.data.topicId}-${job.data?.id ?? 'existing'}`} ai={ai.data} />
      ) : (
        src &&
        processing && (
          <div className="space-y-3" aria-busy="true" aria-label="Waiting for AI results">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-64 rounded-xl" />
            <p className="text-sm text-muted-foreground">
              Transcript, summary, flashcards and quiz appear here when processing finishes.
            </p>
          </div>
        )
      )}
    </div>
  );
}
