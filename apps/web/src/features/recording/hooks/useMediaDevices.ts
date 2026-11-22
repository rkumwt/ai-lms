import { useCallback, useEffect, useState } from 'react';

import { support } from '../lib/media';

export interface DeviceOption {
  deviceId: string;
  label: string;
}

/** Lists microphones and cameras; labels appear once the user has granted permission. */
export function useMediaDevices() {
  const [mics, setMics] = useState<DeviceOption[]>([]);
  const [cameras, setCameras] = useState<DeviceOption[]>([]);

  const refresh = useCallback(async () => {
    if (!support.media) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const map = (kind: MediaDeviceKind, fallback: string) =>
      devices
        .filter((d) => d.kind === kind && d.deviceId)
        .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `${fallback} ${i + 1}` }));
    setMics(map('audioinput', 'Microphone'));
    setCameras(map('videoinput', 'Camera'));
  }, []);

  useEffect(() => {
    if (!support.media) return;
    void refresh();
    navigator.mediaDevices.addEventListener('devicechange', refresh);
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh);
  }, [refresh]);

  return { mics, cameras, refresh };
}
