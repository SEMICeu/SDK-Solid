import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'movejs',
      // the proper extensions will be added
      fileName: 'main',
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: ['src/main.ts', '.eslintrc.cjs', '**/*-model.ts'],
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