import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Vite is run in middleware mode by the Hono server during dev (see src/server/index.ts).
// This config is also used directly when running `vite build` for the production bundle.
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@client': resolve(__dirname, 'src/client'),
    },
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  // Pin esbuild's tsconfig to our client config so it doesn't walk up to the
  // parent Expo monorepo's tsconfig (which extends "expo/tsconfig.base").
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        target: 'es2022',
        useDefineForClassFields: true,
        jsx: 'react-jsx',
      },
    },
  },
  appType: 'custom',
});
