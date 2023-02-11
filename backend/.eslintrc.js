module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'prettier',
    '@typescript-eslint/eslint-plugin',
    'sort-imports-es6-autofix',
    'hexagonal-architecture',
  ],
  ignorePatterns: [
    '.eslintrc.js', 'node_modules', 'dist', 'data'
   ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/prefer-default-export': 0,
    'no-throw-literal': 0,
    'prefer-const': 'warn',
    'no-console': 'warn',
    'no-prototype-builtins': 0,
    'prefer-rest-params': 'off',
    'security/detect-object-injection': 0,
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', args: 'none' }],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'single', 'all', 'multiple'],
      },
    ],
  },
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "hexagonal-architecture/enforce": ["error"],
      },
    },
  ]
};