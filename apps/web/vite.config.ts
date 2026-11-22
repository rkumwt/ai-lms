import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 5173 },
  build: {
    // Excalidraw ships ~1.8 MB lazy chunks (fonts, mermaid); they load only in whiteboard mode.
    chunkSizeWarningLimit: 2000,
  },
});
