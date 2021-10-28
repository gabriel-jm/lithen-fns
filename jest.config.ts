import { Config } from '@jest/types'

export default <Config.InitialOptions> {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  rootDir: './',
  collectCoverageFrom: ['./src/**/*.ts'],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1'
  }
}
