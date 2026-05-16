import { useState, useEffect, useCallback } from 'react';
import { parseUrlHash, buildUrlHash } from '../utils/url';

/**
 * Syncs filter state with the URL hash.
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
      setFiltersInternal(parseUrlHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setFilters = useCallback((newFilters) => {
    const hash = buildUrlHash(newFilters);
    window.history.replaceState(null, '', hash || window.location.pathname);
    setFiltersInternal(newFilters);
  }, []);

  return [filters, setFilters];
}
