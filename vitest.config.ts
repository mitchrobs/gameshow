import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,tsx}'],
    exclude: ['node_modules/**', 'node_modules 2/**', 'dist/**', 'tools/**'],
  },
});
