module.exports = {
  root: true,
  extends: ['base-linter'],
  plugins: ['hexagonal-architecture'],
  overrides: [
    {
      files: ['**/?*.[jt]s'],
      rules: {
        'hexagonal-architecture/enforce': ['error'],
      },
    },
  ],
};
