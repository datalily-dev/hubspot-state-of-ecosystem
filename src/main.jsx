import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';

// Preload the fonts used above-the-fold (Cover page) so the browser fetches
// them in parallel with the CSS, instead of discovering them only after the
// CSS has been parsed. Vite rewrites these import URLs to the hashed asset
// paths at build time, so the preloads match what the @font-face rules
// actually request.
import serifBookUrl from './assets/fonts/HubSpotSerif-Book.woff2?url';
import sansBookUrl from './assets/fonts/HubSpotSans-Book.woff2?url';
import sansBoldUrl from './assets/fonts/HubSpotSans-Bold.woff2?url';

[serifBookUrl, sansBookUrl, sansBoldUrl].forEach((href) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.href = href;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
