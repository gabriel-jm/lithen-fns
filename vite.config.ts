import { defineConfig } from 'vitest/config'
import path from 'path'
import { randomUUID, getRandomValues } from 'crypto'

var crypto = { randomUUID, getRandomValues }

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
