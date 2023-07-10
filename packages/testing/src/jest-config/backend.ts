import { baseConfig } from './base';

export const backendConfig = {
  ...baseConfig,
  rootDir: '.',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/test/',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/src/$1', '<rootDir>/../../src/$1'],
  },
};
