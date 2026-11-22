import type { ReactNode } from 'react';
import { AlertTriangle, Camera, Circle, Settings2, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { SOURCE_META } from '../../sources';
import type { MediaErrorInfo, RecordingConfig } from '../../types';

interface StudioMessageProps {
  config: RecordingConfig;
  error: MediaErrorInfo | null;
  displayUnsupported: boolean;
  onStart: () => void;
  onSetup: () => void;
  onUseCamera: () => void;
  floating?: boolean;
}

function Shell({
  icon: Icon,
  tone,
  children,
  floating,
}: {
  icon: LucideIcon;
  tone: 'default' | 'error';
  children: ReactNode;
  floating?: boolean;
}) {
  return (
    <div
      className={cn(
        'z-20 w-[min(440px,calc(100%-2rem))] rounded-xl border bg-card text-center shadow-soft-lg',
        // Floating (whiteboard) sits bottom-centre so Excalidraw's top toolbar stays usable.
        floating ? 'absolute bottom-16 left-1/2 -translate-x-1/2 p-4' : 'relative p-6',
      )}
      role={tone === 'error' ? 'alert' : undefined}
    >
      <div
        className={cn(
          'mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary',
          tone === 'error' && 'bg-destructive/10 text-destructive',
          floating && 'hidden',
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      {children}
    </div>
  );
}

export function StudioMessage({
  config,
  error,
  displayUnsupported,
  onStart,
  onSetup,
  onUseCamera,
  floating,
}: StudioMessageProps) {
  if (displayUnsupported) {
    return (
      <Shell icon={AlertTriangle} tone="error" floating={floating}>
        <h2 className="font-semibold">Screen recording isn’t available here</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This browser or device can’t share the screen. You can still record with your camera.
        </p>
        <Button className="mt-4" onClick={onUseCamera}>
          <Camera aria-hidden /> Use camera instead
        </Button>
      </Shell>
    );
  }
  if (error) {
    return (
      <Shell icon={AlertTriangle} tone="error" floating={floating}>
        <h2 className="font-semibold">{error.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={onSetup}>
            <Settings2 aria-hidden /> Change setup
          </Button>
          {error.kind !== 'unsupported' && <Button onClick={onStart}>Try again</Button>}
        </div>
      </Shell>
    );
  }
  const meta = SOURCE_META[config.source];
  const hint =
    config.source === 'whiteboard'
      ? 'When asked, share “This tab” so the whiteboard and your webcam bubble are recorded.'
      : config.source === 'camera'
        ? 'Your browser will ask for camera and microphone access.'
        : 'Your browser will ask which screen, window or tab to share.';
  return (
    <Shell icon={meta.icon} tone="default" floating={floating}>
      <h2 className="font-semibold">Ready to record · {meta.label}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" onClick={onSetup}>
          <Settings2 aria-hidden /> Setup
        </Button>
        <Button onClick={onStart}>
          <Circle className="fill-red-400 text-red-400" aria-hidden /> Start recording
        </Button>
      </div>
    </Shell>
  );
}
