module.exports = {
  // Specifies the ESLint parser
  parser: '@typescript-eslint/parser',

  // Which files to not lint
  ignorePatterns: [
    'src/__tests__/**/*.*'
  ],

  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2020,
    // Allows for the use of imports
    sourceType: 'module'
  },

  // The base rules this project extends from
  extends: [
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended'
  ],

  // additional function from 3rd parties
  plugins: [],

  // Rules in addition to the base
  rules: {
    // Eslint overrides
    'curly': ['error', 'all'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'max-lines-per-function': ['error', 50],
    'prefer-rest-params': 0,

    // Typescript overrides
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false }
    ]
  }
};
