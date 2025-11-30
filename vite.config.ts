/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Type assertion needed due to version mismatch between vite and vitest's bundled vite
export default defineConfig({
  // @ts-expect-error - Version mismatch between vite and vitest's bundled vite types
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
