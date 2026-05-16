import { useRef, useCallback } from 'react';

/**
 * Provides a throttled wheel/touch handler for scroll-to-advance page transitions.
 * Each page declares its own scroll behavior by calling this hook.
 *
 * @param {{ onAdvance?: () => void, onRetreat?: () => void, throttleMs?: number }} options
 */
export function useScrollBehavior({ onAdvance, onRetreat, throttleMs = 800 } = {}) {
  const isThrottled = useRef(false);

  const trigger = useCallback(
    (direction) => {
      if (isThrottled.current) return;
      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, throttleMs);

      if (direction > 0 && onAdvance) onAdvance();
      if (direction < 0 && onRetreat) onRetreat();
    },
    [onAdvance, onRetreat, throttleMs],
  );

  const handleWheel = useCallback(
    (e) => {
      trigger(e.deltaY);
    },
    [trigger],
  );

  return { handleWheel };
}
