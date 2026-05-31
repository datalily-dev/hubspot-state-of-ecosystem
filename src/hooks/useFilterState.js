import { useState, useCallback } from 'react';

const INITIAL_FILTERS = { partnerType: null, segment: null, region: null };

/**
 * Manages the two-stage filter state: pending (in modal) and confirmed (applied).
 * Pending filters reset downstream when a parent-level filter changes.
 */
export function useFilterState(initialFilters = INITIAL_FILTERS) {
  const [pendingFilters, setPendingFilters] = useState(initialFilters);
  const [confirmedFilters, setConfirmedFilters] = useState(initialFilters);

  const setPendingPartnerType = useCallback((partnerType) => {
    setPendingFilters({ partnerType, segment: null, region: null });
  }, []);

  const setPendingSegment = useCallback((segment) => {
    setPendingFilters((prev) => ({ ...prev, segment }));
  }, []);

  const setPendingRegion = useCallback((region) => {
    setPendingFilters((prev) => ({ ...prev, region }));
  }, []);

  const confirmFilters = useCallback(() => {
    setConfirmedFilters(pendingFilters);
  }, [pendingFilters]);

  const openModal = useCallback(() => {
    setPendingFilters(confirmedFilters);
  }, [confirmedFilters]);

  const resetFilters = useCallback(() => {
    setPendingFilters(INITIAL_FILTERS);
    setConfirmedFilters(INITIAL_FILTERS);
  }, []);

  return {
    pendingFilters,
    confirmedFilters,
    setPendingPartnerType,
    setPendingSegment,
    setPendingRegion,
    confirmFilters,
    openModal,
    resetFilters,
  };
}
