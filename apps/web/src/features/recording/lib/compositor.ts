import type { BubbleState } from '../types';

interface CompositorOptions {
  display: MediaStream;
  camera: MediaStream | null;
  getBubble: () => BubbleState & { visible: boolean };
  fps?: number;
}

function playingVideo(stream: MediaStream): HTMLVideoElement {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  void video.play();
  return video;
}

/**
 * Draws the shared screen plus a round camera bubble onto a canvas and returns its stream.
 * A tiny Web Worker drives the frame timer because main-thread timers are throttled
 * while the user is looking at the window they are sharing.
 */
export function createCompositor({ display, camera, getBubble, fps = 30 }: CompositorOptions) {
  const screenVideo = playingVideo(display);
  const cameraVideo = camera ? playingVideo(camera) : null;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const settings = display.getVideoTracks()[0]?.getSettings();
  canvas.width = settings?.width ?? 1920;
  canvas.height = settings?.height ?? 1080;

  const draw = () => {
    if (!ctx) return;
    if (screenVideo.videoWidth && screenVideo.videoWidth !== canvas.width) {
      canvas.width = screenVideo.videoWidth;
      canvas.height = screenVideo.videoHeight;
    }
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    const bubble = getBubble();
    if (!cameraVideo || !bubble.visible || !cameraVideo.videoWidth) return;
    const d = bubble.size * canvas.height;
    const cx = bubble.x * canvas.width;
    const cy = bubble.y * canvas.height;
    const side = Math.min(cameraVideo.videoWidth, cameraVideo.videoHeight);
    const sx = (cameraVideo.videoWidth - side) / 2;
    const sy = (cameraVideo.videoHeight - side) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
    ctx.clip();
    // Mirror the selfie view, like the on-screen bubble.
    ctx.translate(cx + d / 2, cy - d / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, sx, sy, side, side, 0, 0, d, d);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(4, d * 0.02);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.stroke();
  };

  const workerUrl = URL.createObjectURL(
    new Blob([`setInterval(() => postMessage(0), ${Math.round(1000 / fps)});`], {
      type: 'text/javascript',
    }),
  );
  const ticker = new Worker(workerUrl);
  ticker.onmessage = draw;

  return {
    stream: canvas.captureStream(fps),
    stop() {
      ticker.terminate();
      URL.revokeObjectURL(workerUrl);
      screenVideo.srcObject = null;
      if (cameraVideo) cameraVideo.srcObject = null;
    },
  };
}
