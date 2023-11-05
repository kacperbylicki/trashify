const postfixesToIgnore = ['.module.ts', '.controller.ts', '.config.ts'];

const arrayOfIgnoredPostfixes = postfixesToIgnore.map((postfix) => `!<rootDir>/src/**/*${postfix}`);

/**
 * @type {import('jest').Config}
 */
module.exports = {
  ...require('@trashify/testing').backendConfig,
  displayName: 'integration-tests',
  rootDir: '../../',
  testMatch: ['<rootDir>/test/integration/**/*.(spec|test).(ts|js)'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/**/index.ts',
    ...arrayOfIgnoredPostfixes,
    '!<rootDir>/src/**/*.dto.ts',
    '!<rootDir>/src/**/main.ts',
  ],
};
