/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://vitest.dev/config/
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
    exclude: ['/node_modules/', '/dist/', 'index.test'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/__tests__/**',
        'src/__mocks__/**',
        'src/index.ts',
      ],
      thresholds: {
        global: {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@inquirer/prompts': path.resolve(
        __dirname,
        'src/__mocks__/inquirer-prompts.ts'
      ),
      'package-manager-detector': path.resolve(
        __dirname,
        'src/__mocks__/package-manager-detector.ts'
      ),
    },
  },
});
