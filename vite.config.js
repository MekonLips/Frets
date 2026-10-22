import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Frets — Guitar Fretboard Practice',
        short_name: 'Frets',
        description: 'Five-minute guitar fretboard note practice.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        icons: [
          { src: '/logo192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      // Installation support only for this phase. Offline caching will be
      // designed and enabled separately once the app is ready for offline use.
      workbox: { globPatterns: [] },
      devOptions: { enabled: false },
    }),
  ],
  base: '/',
  build: { outDir: 'dist', sourcemap: true },
});
