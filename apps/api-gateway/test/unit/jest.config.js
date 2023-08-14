module.exports = {
  ...require('@trashify/testing').backendConfig,
  displayName: 'unit-tests',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*.(spec|test).(ts|js)'],
};
