import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  build: {
    outDir: 'dist/preload',
    lib: {
      entry: 'src/preload.js',
      formats: ['cjs'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      external: ['electron'],
    },
    minify: process.env.NODE_ENV === 'production',
    emptyOutDir: true,
    watch: process.env.NODE_ENV === 'development' ? {} : null,
  }
});
