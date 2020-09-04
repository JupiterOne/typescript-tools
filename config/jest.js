module.exports = {
  clearMocks: true,
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: ['src/**/*.ts', '!**/*.test.ts', '!**/__tests__/**'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~(/.*)$': '<rootDir>$1',
  },
};
