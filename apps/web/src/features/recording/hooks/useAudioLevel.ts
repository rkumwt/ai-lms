import { useEffect, useState } from 'react';

/** Returns a 0–1 loudness value for the stream's first audio track, updated ~20×/s. */
export function useAudioLevel(stream: MediaStream | null): number {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream || !stream.getAudioTracks().length) {
      setLevel(0);
      return;
    }
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const id = window.setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += ((v - 128) / 128) ** 2;
      setLevel(Math.min(1, Math.sqrt(sum / data.length) * 3));
    }, 50);
    return () => {
      window.clearInterval(id);
      source.disconnect();
      void context.close();
    };
  }, [stream]);

  return level;
}
