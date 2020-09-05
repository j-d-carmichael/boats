module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/**.{js,ts}',
  ],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],
  testMatch: [
    '**/*.spec.(js|jsx|ts|tsx)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '/build/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
}
