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
    '^inquirer$': '<rootDir>/src/__mocks__/inquirer.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
};

export default config;
