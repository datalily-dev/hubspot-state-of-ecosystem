import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/hubspot-state-of-ecosystem/',
  plugins: [
    react(),
    svgr(),
  ],
  build: {
    // Modern browser targets (Chrome/FF/Safari/Edge latest, per project reqs)
    // — produces smaller JS by skipping legacy transforms.
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split React out of the main bundle so it's cached independently of
        // app code, and keep each lazy-loaded page in its own chunk (default
        // Rollup behavior when using dynamic import()).
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
  },
});
