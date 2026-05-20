import { useEffect, useState } from 'react';
import { useSlideDeck } from '../context/SlideDeckContext';

// Brief hold after the slide lands (SlideDeck push is 500ms) before animating.
const SLIDE_ENTRANCE_DELAY_MS = 300;

/**
 * Defers entrance animations until a SlideDeck page is active and the
 * transition has settled. Resets when the user navigates away so revisits replay.
 */
export function useSlideEntrance(anchorId) {
  const { activeAnchor } = useSlideDeck();
  const isPageActive = activeAnchor === anchorId;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isPageActive) {
      setIsReady(false);
      return undefined;
    }

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setIsReady(true);
      return undefined;
    }

    setIsReady(false);
    const id = window.setTimeout(() => setIsReady(true), SLIDE_ENTRANCE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isPageActive]);

  return isReady;
}
