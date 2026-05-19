import { createContext, useContext, useMemo } from 'react';

const SlideDeckContext = createContext(null);

export function SlideDeckProvider({ activeAnchor, slideTheme, children }) {
  const value = useMemo(
    () => ({ activeAnchor, slideTheme }),
    [activeAnchor, slideTheme],
  );
  return (
    <SlideDeckContext.Provider value={value}>
      {children}
    </SlideDeckContext.Provider>
  );
}

export function useSlideDeck() {
  const ctx = useContext(SlideDeckContext);
  if (!ctx) {
    throw new Error('useSlideDeck must be used within SlideDeckProvider');
  }
  return ctx;
}

/** Optional hook for components that may render outside the deck (e.g. modals). */
export function useSlideDeckOptional() {
  return useContext(SlideDeckContext);
}
