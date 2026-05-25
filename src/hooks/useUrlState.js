import { useState, useEffect, useCallback } from 'react';
import { parseUrlHash, buildUrlHash, splitHash } from '../utils/url';

/**
 * Syncs filter state with the URL hash. The hash format is
 * `#<slide-anchor>?<filterParams>`; this hook only owns the filter half and
 * preserves whatever slide anchor SlideDeck currently has set.
 *
 * On mount, reads initial state from the hash.
 * On change, updates the hash via replaceState (no history entry added).
 * Listens for hash changes to support back/forward navigation and link sharing.
 */
export function useUrlState() {
  const [filters, setFiltersInternal] = useState(() =>
    parseUrlHash(window.location.hash),
  );

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseUrlHash(window.location.hash);
      const hasNext = next.partnerType || next.segment || next.region;
      // Anchor-link clicks (e.g. `<a href="#cover">`) replace the entire hash
      // with a bare slide anchor and wipe out the filter query in the process.
      // If our local state has filters but the new URL doesn't, re-attach the
      // filter query to the current anchor instead of accepting the wipe.
      if (!hasNext) {
        setFiltersInternal((prev) => {
          const hasPrev = prev.partnerType || prev.segment || prev.region;
          if (!hasPrev) return next;
          const { anchor } = splitHash(window.location.hash);
          const restored = buildUrlHash(prev, anchor);
          window.history.replaceState(
            null,
            '',
            restored || `${window.location.pathname}${window.location.search}`,
          );
          return prev;
        });
        return;
      }
      setFiltersInternal(next);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setFilters = useCallback((newFilters) => {
    const { anchor } = splitHash(window.location.hash);
    const hash = buildUrlHash(newFilters, anchor);
    window.history.replaceState(
      null,
      '',
      hash || `${window.location.pathname}${window.location.search}`,
    );
    setFiltersInternal(newFilters);
  }, []);

  return [filters, setFilters];
}
