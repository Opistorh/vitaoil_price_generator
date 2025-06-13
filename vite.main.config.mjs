import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { node } from '../../package.json';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  build: {
    outDir: 'dist/main',
    lib: {
      entry: 'src/main.js',
      formats: ['cjs'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      external: ['electron', 'path', 'fs'],
    },
    minify: process.env.NODE_ENV === 'production',
    emptyOutDir: true,
    watch: process.env.NODE_ENV === 'development' ? {} : null,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
