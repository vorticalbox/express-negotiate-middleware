module.exports = {
  env: {
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:jsdoc/recommended',
    'plugin:unicorn/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'import',
    'jsdoc',
  ],
  rules: {
    // most rules should error instead of warn
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    curly: ['error', 'all'],
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        '.spec.ts': 'never',
        tsx: 'never',
      },
    ],
    'no-shadow': 'off', // replaced by ts-eslint rule below
    '@typescript-eslint/no-shadow': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_[a-zA-Z]',
      varsIgnorePattern: '^_[a-zA-Z]',
    }],
    'no-restricted-syntax': ['off'],
    // code that needs to be cleanup should warn
    'unicorn/no-null': 'warn',
    // These are the exceptions that don't actually catch bugs
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-array-for-each': 'warn',
    // MongoDb Exceptions
    'no-underscore-dangle': ['error', {
      allow: [
        '_id',
        '_collection',
        '_v',
      ],
    }],
    //
  },
  ignorePatterns: ['/node_modules', '/dist', '/src/playground.ts'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
