import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
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
      external: ['electron', 'path', 'fs', 'crypto', 'stream', 'util', 'buffer', 'events', 'assert', 'url', 'http', 'https', 'os', 'zlib', 'net', 'tls', 'child_process', 'dgram', 'dns', 'module', 'process'],
    },
    minify: process.env.NODE_ENV === 'production',
    emptyOutDir: true,
    watch: process.env.NODE_ENV === 'development' ? {} : null,
    copyPublicDir: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
});
