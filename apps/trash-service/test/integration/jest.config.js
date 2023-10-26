module.exports = {
  ...require('@trashify/testing').backendConfig,
  displayName: 'integration-tests',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*.(spec|test).(ts|js)'],
};
