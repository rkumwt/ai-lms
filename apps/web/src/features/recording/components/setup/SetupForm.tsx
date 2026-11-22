import { Play, Timer, Type } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRecordingStore } from '@/stores/recordingStore';
import type { RecordingQuality, Settings } from '@/types';

import { useMediaDevices } from '../../hooks/useMediaDevices';
import { usePreviewStream } from '../../hooks/usePreviewStream';
import { support } from '../../lib/media';
import { needsCamera, needsDisplay, type RecordingConfig } from '../../types';

import { DeviceSettings } from './DeviceSettings';
import { SourcePicker } from './SourcePicker';
import { TopicPicker } from './TopicPicker';

interface SetupFormProps {
  initialTopicId: string | null;
  initialCourseId: string | null;
  defaults: Settings['recording'];
  onDone: () => void;
}

export function SetupForm({ initialTopicId, initialCourseId, defaults, onDone }: SetupFormProps) {
  const navigate = useNavigate();
  const previous = useRecordingStore((s) => s.config);
  const setConfig = useRecordingStore((s) => s.setConfig);
  const [courseId, setCourseId] = useState(initialCourseId);
  const [topicId, setTopicId] = useState(initialTopicId);
  const fallbackSource =
    needsDisplay(defaults.source) && !support.display ? 'camera' : defaults.source;
  const [cfg, setCfg] = useState<Omit<RecordingConfig, 'topicId'>>({
    source: previous?.source ?? fallbackSource,
    micId: previous?.micId ?? null,
    cameraId: previous?.cameraId ?? null,
    countdown: previous?.countdown ?? defaults.countdown,
    teleprompter: previous?.teleprompter ?? defaults.teleprompter,
    quality: previous?.quality ?? defaults.quality,
  });
  const update = (patch: Partial<typeof cfg>) => setCfg((c) => ({ ...c, ...patch }));
  const devices = useMediaDevices();
  const withCamera = needsCamera(cfg.source);
  const preview = usePreviewStream({
    enabled: support.media,
    micId: cfg.micId,
    cameraId: cfg.cameraId,
    withCamera,
    onGranted: () => void devices.refresh(),
  });

  const start = () => {
    if (!topicId) return;
    setConfig({ ...cfg, topicId });
    onDone();
    navigate(`/topics/${topicId}/record`);
  };

  if (!support.media || !support.recorder) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
      >
        <p className="font-medium">Recording isn’t supported in this browser.</p>
        <p className="mt-1 text-muted-foreground">
          Use the latest Chrome, Edge or Firefox on a desktop computer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!initialTopicId && (
        <TopicPicker
          courseId={courseId}
          topicId={topicId}
          onCourseChange={(id) => {
            setCourseId(id);
            setTopicId(null);
          }}
          onTopicChange={setTopicId}
        />
      )}
      <SourcePicker value={cfg.source} onChange={(source) => update({ source })} />
      <DeviceSettings
        mics={devices.mics}
        cameras={devices.cameras}
        micId={cfg.micId}
        cameraId={cfg.cameraId}
        onMicChange={(micId) => update({ micId })}
        onCameraChange={(cameraId) => update({ cameraId })}
        withCamera={withCamera}
        stream={preview.stream}
        error={preview.error}
        onRetry={preview.retry}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <Label htmlFor="setup-countdown" className="flex items-center gap-2 font-normal">
            <Timer className="size-4 text-muted-foreground" aria-hidden /> 3s countdown
          </Label>
          <Switch
            id="setup-countdown"
            checked={cfg.countdown}
            onCheckedChange={(countdown) => update({ countdown })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <Label htmlFor="setup-teleprompter" className="flex items-center gap-2 font-normal">
            <Type className="size-4 text-muted-foreground" aria-hidden /> Teleprompter
          </Label>
          <Switch
            id="setup-teleprompter"
            checked={cfg.teleprompter}
            onCheckedChange={(teleprompter) => update({ teleprompter })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <Label htmlFor="setup-quality" className="font-normal">
            Quality
          </Label>
          <Select
            value={cfg.quality}
            onValueChange={(v) => update({ quality: v as RecordingQuality })}
          >
            <SelectTrigger id="setup-quality" className="h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="button" onClick={start} disabled={!topicId}>
          <Play aria-hidden /> Open studio
        </Button>
      </DialogFooter>
    </div>
  );
}
