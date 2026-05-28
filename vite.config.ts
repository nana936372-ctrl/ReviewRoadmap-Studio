import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: react() as unknown as Plugin[],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true
  }
});
