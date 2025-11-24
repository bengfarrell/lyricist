import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  envDir: '../', // Look for .env files in project root
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
  plugins: [
    VitePWA({
      registerType: 'prompt', // Prompt user when new version is available
      includeAssets: ['sample-content.json', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'Lyricist - Song Creator',
        short_name: 'Lyricist',
        description: 'A creative tool for writing and organizing song lyrics',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Clean old caches automatically
        cleanupOutdatedCaches: true,
        
        // Always check for updates when online
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.execute-api\..*\.amazonaws\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable in dev to avoid confusion
      }
    })
  ]
});

