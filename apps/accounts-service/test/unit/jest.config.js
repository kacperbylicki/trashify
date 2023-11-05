module.exports = {
  ...require('@trashify/testing').backendConfig,
  displayName: 'unit-tests',
  rootDir: '../../',
  testMatch: ['<rootDir>/test/unit**/*.(spec|test).(ts|js)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};
