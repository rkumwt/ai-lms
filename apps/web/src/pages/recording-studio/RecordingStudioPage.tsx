import { ArrowLeft, Settings2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RecordingSetupDialog } from '@/features/recording/components/RecordingSetupDialog';
import { CountdownOverlay } from '@/features/recording/components/studio/CountdownOverlay';
import { RecorderBar } from '@/features/recording/components/studio/RecorderBar';
import { StudioMessage } from '@/features/recording/components/studio/StudioMessage';
import { StudioStage } from '@/features/recording/components/studio/StudioStage';
import { TeleprompterPanel } from '@/features/recording/components/studio/TeleprompterPanel';
import { useLeaveGuard } from '@/features/recording/hooks/useLeaveGuard';
import { useRecorder } from '@/features/recording/hooks/useRecorder';
import { support } from '@/features/recording/lib/media';
import { SOURCE_META } from '@/features/recording/sources';
import {
  needsCamera,
  needsDisplay,
  type BubbleState,
  type RecordingConfig,
  type RecordingResult,
} from '@/features/recording/types';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useTopic } from '@/features/topics/hooks/useTopics';
import { formatTimestamp } from '@/lib/format';
import { useRecordingStore } from '@/stores/recordingStore';
import { useUiStore } from '@/stores/uiStore';
import type { Settings, TopicWithCourse } from '@/types';

function Studio({ topic, config }: { topic: TopicWithCourse; config: RecordingConfig }) {
  const navigate = useNavigate();
  const setConfig = useRecordingStore((s) => s.setConfig);
  const setResult = useRecordingStore((s) => s.setResult);
  const openRecordSetup = useUiStore((s) => s.openRecordSetup);
  const [bubble, setBubble] = useState<BubbleState>({ x: 0.85, y: 0.78, size: 0.28 });
  const bubbleRef = useRef(bubble);
  bubbleRef.current = bubble;
  const [teleprompterOpen, setTeleprompterOpen] = useState(config.teleprompter);

  const allowLeave = useRef<() => void>(() => undefined);
  const onFinished = useCallback(
    (result: RecordingResult) => {
      setResult(result);
      allowLeave.current();
      toast.success('Recording saved locally', {
        description: `${formatTimestamp(result.durationSec)} · ready for AI processing`,
      });
      navigate(`/topics/${topic.id}/review`);
    },
    [navigate, setResult, topic.id],
  );
  const rec = useRecorder({ config, getBubble: () => bubbleRef.current, onFinished });
  const active = ['acquiring', 'countdown', 'recording', 'paused', 'stopping'].includes(rec.status);
  const leave = useLeaveGuard(active);
  allowLeave.current = leave.allow;

  const displayUnsupported = needsDisplay(config.source) && !support.display;
  const showMessage =
    (rec.status === 'idle' || rec.status === 'error') && !rec.displayStream && !rec.cameraStream;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-2.5">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/topics/${topic.id}/edit`}>
            <ArrowLeft aria-hidden /> <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold sm:text-base">{topic.title}</h1>
          <p className="truncate text-xs text-muted-foreground">{topic.courseTitle}</p>
        </div>
        <Badge variant="outline" className="hidden sm:inline-flex">
          {SOURCE_META[config.source].label} · {config.quality}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openRecordSetup(topic.id)}
          disabled={active}
        >
          <Settings2 aria-hidden /> <span className="hidden sm:inline">Setup</span>
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <StudioStage
          config={config}
          displayStream={rec.displayStream}
          cameraStream={rec.cameraStream}
          camOn={rec.camOn}
          bubble={bubble}
          onBubbleChange={setBubble}
        >
          {showMessage && (
            <StudioMessage
              config={config}
              error={rec.error}
              displayUnsupported={displayUnsupported}
              onStart={() => void rec.start()}
              onSetup={() => openRecordSetup(topic.id)}
              onUseCamera={() => setConfig({ ...config, source: 'camera' })}
              floating={config.source === 'whiteboard'}
            />
          )}
          {rec.status === 'countdown' && (
            <CountdownOverlay value={rec.countdown} onCancel={rec.stop} />
          )}
        </StudioStage>
        {teleprompterOpen && (
          <div className="max-h-[40dvh] sm:max-h-none">
            <TeleprompterPanel
              topicId={topic.id}
              notesHtml={topic.notesHtml}
              onClose={() => setTeleprompterOpen(false)}
            />
          </div>
        )}
      </div>

      <RecorderBar
        status={rec.status}
        elapsedMs={rec.elapsedMs}
        micOn={rec.micOn}
        camOn={rec.camOn}
        showCamToggle={needsCamera(config.source)}
        teleprompterOpen={teleprompterOpen}
        onStart={() => void rec.start()}
        onPause={rec.pause}
        onResume={rec.resume}
        onStop={rec.stop}
        onToggleMic={rec.toggleMic}
        onToggleCam={rec.toggleCam}
        onToggleTeleprompter={() => setTeleprompterOpen((o) => !o)}
      />

      <RecordingSetupDialog />
      <ConfirmDialog
        open={leave.blocker.state === 'blocked'}
        onOpenChange={(open) => !open && leave.blocker.reset?.()}
        title="Discard this recording?"
        description="You are still recording. Leaving now discards everything recorded so far."
        confirmLabel="Discard and leave"
        destructive
        onConfirm={() => leave.blocker.proceed?.()}
      />
    </div>
  );
}

function defaultConfig(topicId: string, settings: Settings): RecordingConfig {
  return { topicId, micId: null, cameraId: null, ...settings.recording };
}

export default function RecordingStudioPage() {
  const { topicId = '' } = useParams();
  const topic = useTopic(topicId);
  const settings = useSettings();
  const stored = useRecordingStore((s) => s.config);

  if (topic.error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Could not open the studio"
          error={topic.error}
          onRetry={() => void topic.refetch()}
        />
      </div>
    );
  }
  if (!topic.data || !settings.data) {
    return (
      <div className="flex h-dvh flex-col gap-4 p-4" aria-busy="true" aria-label="Loading studio">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="flex-1 rounded-xl" />
        <Skeleton className="h-14" />
      </div>
    );
  }
  const config = stored?.topicId === topicId ? stored : defaultConfig(topicId, settings.data);
  return (
    <Studio
      key={`${config.source}-${config.micId}-${config.cameraId}`}
      topic={topic.data}
      config={config}
    />
  );
}
