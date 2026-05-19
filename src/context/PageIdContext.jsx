import { createContext, useContext } from 'react';

const PageIdContext = createContext(null);

export function PageIdProvider({ pageId, children }) {
  return (
    <PageIdContext.Provider value={pageId}>
      {children}
    </PageIdContext.Provider>
  );
}

export function usePageId() {
  return useContext(PageIdContext);
}
