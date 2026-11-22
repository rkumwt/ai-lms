import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useRecordingStore } from '@/stores/recordingStore';

import { useUploadRecording } from './useProcessing';

/** Sends a fresh local recording for this topic to the (mock) API once, starting AI processing. */
export function useAutoUpload(topicId: string) {
  const result = useRecordingStore((s) => s.result);
  const markUploaded = useRecordingStore((s) => s.markUploaded);
  const upload = useUploadRecording();
  const started = useRef<string | null>(null);
  const pending = result?.topicId === topicId && !result.uploaded ? result : null;

  useEffect(() => {
    if (!pending || started.current === pending.blobUrl) return;
    started.current = pending.blobUrl;
    upload.mutate(
      { topicId, blobUrl: pending.blobUrl, durationSec: pending.durationSec },
      {
        onSuccess: () => markUploaded(pending.blobUrl),
        onError: (e) => {
          started.current = null;
          toast.error('Upload failed', { description: e.message });
        },
      },
    );
  }, [pending, topicId, upload, markUploaded]);

  return {
    localRecording: result?.topicId === topicId ? result : null,
    uploading: upload.isPending,
  };
}
