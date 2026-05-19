import { useEffect, useState } from 'react';

/**
 * Defers entrance animations until after the first paint so layout (fonts,
 * grid) is stable and React StrictMode's dev double-mount does not cancel
 * in-flight CSS animations mid-run.
 */
export function useEntranceAnimation() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setIsReady(true);
      return undefined;
    }

    let frame = 0;
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => setIsReady(true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return isReady;
}
