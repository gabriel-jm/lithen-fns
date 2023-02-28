import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('src'),
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      exclude: ['tests']
    },
    setupFiles: [
      './tests/_setup/crypto.js'
    ]
  }
})
