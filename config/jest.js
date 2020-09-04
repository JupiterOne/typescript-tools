module.exports = {
  clearMocks: true,
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/*.test.ts', '!**/__tests__/**'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~(/.*)$': '<rootDir>$1',
  },
};
