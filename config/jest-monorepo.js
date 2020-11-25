module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/packages/*/{src,test}/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!**/*.test.ts',
    '!**/__tests__/**',
  ],
};
