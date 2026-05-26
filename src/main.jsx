import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';

// Preload above-the-fold fonts in parallel with CSS so the Cover page doesn't
// wait for the @font-face rules to be discovered. Vite rewrites these `?url`
// imports to the hashed asset paths so the preloads match what CSS requests.
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
