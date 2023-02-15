module.exports = {
  root: true,
  extends: ['backend-linter'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
