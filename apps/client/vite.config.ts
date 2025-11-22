import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  test: {
    coverage: {
      enabled: true
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.js']
  },
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 5173
  }
});
