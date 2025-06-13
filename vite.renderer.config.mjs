import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  base: './',
  root: resolve(process.cwd(), 'src/renderer'),
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    assetsInlineLimit: 0
  },
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
      '@components': resolve(process.cwd(), 'src/components'),
      '@utils': resolve(process.cwd(), 'src/utils')
    },
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
