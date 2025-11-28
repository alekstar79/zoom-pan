import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      exclude: [
        'examples/**',
        '**/react-example.*',
        '**/vue-example.*',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types.ts',
        'vitest.config.ts',
        'node_modules/**',
        'dist/**',
        'coverage/**'
      ],
      include: [
        'src/**/*.{ts,js}'
      ],
      thresholds: {
        lines: 90,
        branches: 80,
        functions: 70,
        statements: 90
      }
    }
  }
})
