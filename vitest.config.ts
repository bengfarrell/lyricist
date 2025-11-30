import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('test-version'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/integration-workflows/setup.ts'],
    include: ['tests/unit/**/*.{test,spec}.ts'], // Unit tests
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/integration/**', // Exclude Playwright tests
      '**/.{idea,git,cache,output,temp}/**',
      '**/*.js', // Exclude compiled JavaScript
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/unit/',
        'tests/integration/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
      ],
    },
    // Handle ESM/CommonJS interop issues
    deps: {
      inline: [
        '@lit-labs/observers',
        '@spectrum-web-components',
      ],
    },
  },
});

