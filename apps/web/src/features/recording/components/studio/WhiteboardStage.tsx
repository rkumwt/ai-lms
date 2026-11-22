import '@excalidraw/excalidraw/index.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { useTheme } from 'next-themes';

/** Excalidraw canvas used as the recording surface in whiteboard mode (lazy-loaded). */
export default function WhiteboardStage() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="absolute inset-0" aria-label="Whiteboard">
      <Excalidraw
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false, export: false } }}
      />
    </div>
  );
}
