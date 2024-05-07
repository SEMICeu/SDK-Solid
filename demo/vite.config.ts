import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false
  },
  test: {
    environment: 'jsdom',
    coverage: {
      exclude: ['src/main.tsx', 'src/vocabulary.ts', '.eslintrc.cjs', 'src/vite-env.d.ts', 'postcss.config.js', 'tailwind.config.js', 'src/patch/**'],
      reporter: ['text'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    },
  },
})
