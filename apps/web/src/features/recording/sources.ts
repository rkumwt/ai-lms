import { Camera, Monitor, MonitorPlay, PenTool, type LucideIcon } from 'lucide-react';

import type { RecordingSource } from '@/types';

export const SOURCE_META: Record<
  RecordingSource,
  { label: string; description: string; icon: LucideIcon }
> = {
  screen: { label: 'Screen', description: 'Share a screen, window or tab', icon: Monitor },
  camera: { label: 'Camera', description: 'Talk straight to camera', icon: Camera },
  screen_camera: {
    label: 'Screen + Camera',
    description: 'Screen with a webcam bubble',
    icon: MonitorPlay,
  },
  whiteboard: {
    label: 'Whiteboard',
    description: 'Sketch on a canvas while you talk',
    icon: PenTool,
  },
};
