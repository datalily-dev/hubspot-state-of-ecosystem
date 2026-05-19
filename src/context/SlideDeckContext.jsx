import { createContext, useContext } from 'react';

const SlideDeckContext = createContext(null);

export function SlideDeckProvider({ activeAnchor, slideTheme, children }) {
  return (
    <SlideDeckContext.Provider value={{ activeAnchor, slideTheme }}>
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
