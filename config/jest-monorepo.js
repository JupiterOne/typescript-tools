module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/packages/*/{src,test}/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/__tests__/**',
  ],

  projects: ['<rootDir>/packages/*'],
};
