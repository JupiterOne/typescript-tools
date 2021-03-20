module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/{src,test}/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/__tests__/**',
  ],
};
