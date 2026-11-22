import { lazy, Suspense, type ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { BubbleState, RecordingConfig } from '../../types';
import { StreamVideo } from '../StreamVideo';

import { WebcamBubble } from './WebcamBubble';

const WhiteboardStage = lazy(() => import('./WhiteboardStage'));

interface StudioStageProps {
  config: RecordingConfig;
  displayStream: MediaStream | null;
  cameraStream: MediaStream | null;
  camOn: boolean;
  bubble: BubbleState;
  onBubbleChange: (b: BubbleState) => void;
  children?: ReactNode;
}

/** The visual area being recorded: shared screen, camera, or whiteboard plus webcam bubble. */
export function StudioStage({
  config,
  displayStream,
  cameraStream,
  camOn,
  bubble,
  onBubbleChange,
  children,
}: StudioStageProps) {
  const { source } = config;
  const showBubble =
    Boolean(cameraStream) && (source === 'screen_camera' || source === 'whiteboard');

  if (source === 'whiteboard') {
    return (
      <div className="relative flex-1 overflow-hidden bg-background">
        <Suspense fallback={<Skeleton className="absolute inset-4 rounded-xl" />}>
          <WhiteboardStage />
        </Suspense>
        {showBubble && (
          <WebcamBubble
            stream={cameraStream}
            value={bubble}
            onChange={onBubbleChange}
            hidden={!camOn}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div
        className={cn(
          'relative aspect-video max-h-full w-full max-w-full overflow-hidden rounded-lg',
          (displayStream || cameraStream) && 'bg-black',
        )}
      >
        {source === 'camera' && cameraStream && (
          <StreamVideo
            stream={cameraStream}
            mirrored
            label="Camera"
            className={cn('size-full', !camOn && 'opacity-0')}
          />
        )}
        {source !== 'camera' && displayStream && (
          <StreamVideo
            stream={displayStream}
            label="Shared screen"
            className="size-full object-contain"
          />
        )}
        {showBubble && (
          <WebcamBubble
            stream={cameraStream}
            value={bubble}
            onChange={onBubbleChange}
            hidden={!camOn}
          />
        )}
      </div>
      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">{children}</div>
      )}
    </div>
  );
}
