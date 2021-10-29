import { Config } from '@jest/types'

export default <Config.InitialOptions> {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src','<rootDir>/tests'],
  rootDir: './',
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageDirectory: './coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1'
  }
}
