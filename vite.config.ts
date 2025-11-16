import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
  optimizeDeps: {
    include: ['lit'],
  },
});

