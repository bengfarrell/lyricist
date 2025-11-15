import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/lyricist-app.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  server: {
    open: true
  }
});

