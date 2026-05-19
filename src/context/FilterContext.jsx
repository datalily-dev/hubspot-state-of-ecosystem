import { createContext, useContext, useMemo, useCallback } from 'react';
import { useFilterState } from '../hooks/useFilterState';
import { useUrlState } from '../hooks/useUrlState';
import { buildFilterId, buildFilterSummary } from '../utils/url';

const FilterContext = createContext(null);

/**
 * Provides hierarchical filter state (partnerType → segment → region) to the
 * entire app. Confirmed filters are synced to the URL hash so pages are shareable.
 *
 * Consumers: use the `useFilters` hook.
 */
export function FilterProvider({ children }) {
  const [, setUrlFilters] = useUrlState();

  const {
    pendingFilters,
    confirmedFilters,
    setPendingPartnerType,
    setPendingSegment,
    setPendingRegion,
    confirmFilters: confirmPending,
    openModal,
    resetFilters,
  } = useFilterState();

  const confirmFilters = useCallback(() => {
    confirmPending();
    setUrlFilters(pendingFilters);
  }, [confirmPending, setUrlFilters, pendingFilters]);

  const filterId = useMemo(() => buildFilterId(confirmedFilters), [confirmedFilters]);
  const filterSummary = useMemo(
    () => buildFilterSummary(confirmedFilters),
    [confirmedFilters],
  );
  const hasActiveFilters = Boolean(confirmedFilters.partnerType);

  const value = useMemo(
    () => ({
      pendingFilters,
      confirmedFilters,
      filterId,
      filterSummary,
      hasActiveFilters,
      setPendingPartnerType,
      setPendingSegment,
      setPendingRegion,
      confirmFilters,
      openModal,
      resetFilters,
    }),
    [
      pendingFilters,
      confirmedFilters,
      filterId,
      filterSummary,
      hasActiveFilters,
      setPendingPartnerType,
      setPendingSegment,
      setPendingRegion,
      confirmFilters,
      openModal,
      resetFilters,
    ],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

/**
 * @returns {{ pendingFilters, confirmedFilters, filterId, filterSummary,
 *   hasActiveFilters, setPendingPartnerType, setPendingSegment, setPendingRegion,
 *   confirmFilters, openModal, resetFilters }}
 */
export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used inside <FilterProvider>');
  }
  return ctx;
}
