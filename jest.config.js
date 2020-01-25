module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.{js,ts}',
  ],
  coverageDirectory: 'coverage',

  testMatch: [
    '**/__tests__/*.spec.js',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],

  testEnvironment: 'node',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  setupFilesAfterEnv: [],
};
