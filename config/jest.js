module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/{src,test}/**/*.test.{ts,tsx}'],
  coverageReporters: ['json-summary', 'text', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/__tests__/**',
  ],
};
