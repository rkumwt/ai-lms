import type { ReactNode } from 'react';
import {
  Circle,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  ScrollText,
  Square,
  Video,
  VideoOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';

import type { RecorderStatus } from '../../types';

interface RecorderBarProps {
  status: RecorderStatus;
  elapsedMs: number;
  micOn: boolean;
  camOn: boolean;
  showCamToggle: boolean;
  teleprompterOpen: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleTeleprompter: () => void;
}

function IconToggle({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'destructive'}
          size="icon"
          className="rounded-full"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function RecorderBar(props: RecorderBarProps) {
  const { status } = props;
  const live = status === 'recording' || status === 'paused';
  const busy = status === 'acquiring' || status === 'stopping';

  return (
    <div className="flex items-center gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex min-w-[120px] items-center gap-2" aria-live="polite">
        <span
          className={cn(
            'size-3 rounded-full bg-muted-foreground/40',
            status === 'recording' && 'animate-blink bg-red-500',
            status === 'paused' && 'bg-warning',
          )}
          aria-hidden
        />
        <span className="font-mono text-sm tabular-nums">
          {formatTimestamp(props.elapsedMs / 1000)}
        </span>
        <span className="sr-only">
          {status === 'recording' ? 'Recording' : status === 'paused' ? 'Paused' : 'Not recording'}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2">
        {!live && (
          <Button
            onClick={props.onStart}
            disabled={busy || status === 'countdown'}
            className="rounded-full px-5"
          >
            {busy ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <Circle className="fill-red-400 text-red-400" aria-hidden />
            )}
            {status === 'stopping'
              ? 'Saving…'
              : status === 'acquiring'
                ? 'Waiting for permission…'
                : 'Start recording'}
          </Button>
        )}
        {live && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={status === 'paused' ? props.onResume : props.onPause}
              aria-label={status === 'paused' ? 'Resume recording' : 'Pause recording'}
            >
              {status === 'paused' ? <Play aria-hidden /> : <Pause aria-hidden />}
            </Button>
            <Button variant="destructive" className="rounded-full px-5" onClick={props.onStop}>
              <Square className="fill-current" aria-hidden /> Stop
            </Button>
          </>
        )}
      </div>

      <div className="flex min-w-[120px] items-center justify-end gap-2">
        <IconToggle
          label={props.micOn ? 'Mute microphone' : 'Unmute microphone'}
          active={props.micOn}
          onClick={props.onToggleMic}
        >
          {props.micOn ? <Mic aria-hidden /> : <MicOff aria-hidden />}
        </IconToggle>
        {props.showCamToggle && (
          <IconToggle
            label={props.camOn ? 'Turn camera off' : 'Turn camera on'}
            active={props.camOn}
            onClick={props.onToggleCam}
          >
            {props.camOn ? <Video aria-hidden /> : <VideoOff aria-hidden />}
          </IconToggle>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={props.teleprompterOpen ? 'secondary' : 'ghost'}
              size="icon"
              className="hidden rounded-full sm:inline-flex"
              onClick={props.onToggleTeleprompter}
              aria-label={props.teleprompterOpen ? 'Hide notes' : 'Show notes'}
              aria-pressed={props.teleprompterOpen}
            >
              <ScrollText aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notes / teleprompter</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
