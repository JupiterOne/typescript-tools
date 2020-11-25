module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/{src,test}/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.ts', '!**/*.test.ts', '!**/__tests__/**'],
};
