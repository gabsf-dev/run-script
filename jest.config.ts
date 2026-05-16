/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@inquirer/prompts$': '<rootDir>/src/__mocks__/inquirer-prompts.ts',
    '^package-manager-detector$':
      '<rootDir>/src/__mocks__/package-manager-detector.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'index.test'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/__mocks__/**',
    '!src/index.ts',
  ],
  coveragePathIgnorePatterns: ['constants.ts', 'index.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
