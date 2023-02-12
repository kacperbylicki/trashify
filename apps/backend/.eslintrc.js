module.exports = {
  root: true,
  extends: ['../../packages/eslint/eslint-backend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
