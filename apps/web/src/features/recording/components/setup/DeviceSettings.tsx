import { CameraOff, Mic, RotateCw, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { DeviceOption } from '../../hooks/useMediaDevices';
import type { MediaErrorInfo } from '../../types';
import { MicLevelMeter } from '../MicLevelMeter';
import { StreamVideo } from '../StreamVideo';

const DEFAULT = 'default-device';

interface DeviceSelectProps {
  id: string;
  label: string;
  icon: typeof Mic;
  devices: DeviceOption[];
  value: string | null;
  onChange: (id: string | null) => void;
}

function DeviceSelect({ id, label, icon: Icon, devices, value, onChange }: DeviceSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden /> {label}
      </Label>
      <Select value={value ?? DEFAULT} onValueChange={(v) => onChange(v === DEFAULT ? null : v)}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT}>System default</SelectItem>
          {devices.map((d) => (
            <SelectItem key={d.deviceId} value={d.deviceId}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface DeviceSettingsProps {
  mics: DeviceOption[];
  cameras: DeviceOption[];
  micId: string | null;
  cameraId: string | null;
  onMicChange: (id: string | null) => void;
  onCameraChange: (id: string | null) => void;
  withCamera: boolean;
  stream: MediaStream | null;
  error: MediaErrorInfo | null;
  onRetry: () => void;
}

export function DeviceSettings(props: DeviceSettingsProps) {
  const { withCamera, stream, error } = props;
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
      <div className="space-y-4">
        <DeviceSelect
          id="setup-mic"
          label="Microphone"
          icon={Mic}
          devices={props.mics}
          value={props.micId}
          onChange={props.onMicChange}
        />
        <MicLevelMeter stream={stream} />
        {withCamera && (
          <DeviceSelect
            id="setup-camera"
            label="Camera"
            icon={Video}
            devices={props.cameras}
            value={props.cameraId}
            onChange={props.onCameraChange}
          />
        )}
      </div>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted sm:aspect-square">
        {error ? (
          <div role="alert" className="space-y-2 p-3 text-center">
            <p className="text-sm font-medium">{error.title}</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
            <Button type="button" size="sm" variant="outline" onClick={props.onRetry}>
              <RotateCw aria-hidden /> Try again
            </Button>
          </div>
        ) : withCamera ? (
          <StreamVideo stream={stream} mirrored label="Camera preview" className="size-full" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-3 text-center text-xs text-muted-foreground">
            <CameraOff className="size-6" aria-hidden />
            Camera not used for this source
          </div>
        )}
      </div>
    </div>
  );
}
