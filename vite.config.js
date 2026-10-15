import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The app is deployed at the domain root; absolute asset URLs also work on deep SPA routes.
  base: '/',
  build: { outDir: 'dist', sourcemap: true },
});