import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  // The legacy app contains JSX in .js files.
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  build: { outDir: 'dist', sourcemap: true },
});
