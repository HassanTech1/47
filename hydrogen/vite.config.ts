import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      // Allow importing images from the frontend assets directories
      '@assets': path.resolve(__dirname, '../frontend/src/assest'),
      '@behind': path.resolve(__dirname, '../frontend/src/behind'),
    },
  },
  server: {
    port: 3001,
    // Allow Vite dev server to serve files from the parent frontend directory
    fs: {
      allow: ['..'],
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
});
