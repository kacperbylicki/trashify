/**@type {import('jest').Config} */
module.exports = {
  ...require('@trashify/testing').backendConfig,
  displayName: 'unit-tests',
  setupFiles: ['<rootDir>/setup.ts'],
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*.(spec|test).(ts|js)'],
};
