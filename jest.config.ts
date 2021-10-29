import { Config } from '@jest/types'

export default <Config.InitialOptions> {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  rootDir: './',
  collectCoverageFrom: ['./src/**/*.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1'
  }
}
