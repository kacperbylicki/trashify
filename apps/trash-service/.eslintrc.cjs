module.exports = {
  root: true,
  extends: ['eslint-config-backend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
