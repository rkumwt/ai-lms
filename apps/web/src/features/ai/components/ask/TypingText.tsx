import { useEffect, useState } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TypingTextProps {
  text: string;
  animate: boolean;
  onDone: () => void;
}

/** Reveals text word by word to mimic streaming; instant when motion is reduced. */
export function TypingText({ text, animate, onDone }: TypingTextProps) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const words = text.split(/(\s+)/);
  const [count, setCount] = useState(animate && !reduced ? 0 : words.length);

  useEffect(() => {
    if (count >= words.length) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setCount((c) => Math.min(words.length, c + 2)), 28);
    return () => window.clearTimeout(id);
    // onDone is stable enough for this effect; re-running on identity would restart typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, words.length]);

  return (
    <span className="whitespace-pre-wrap">
      {words.slice(0, count).join('')}
      {count < words.length && (
        <span
          className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle"
          aria-hidden
        />
      )}
    </span>
  );
}
