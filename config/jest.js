module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/{src,test}/**/*.test.{ts,tsx}'],
  ...(process.env.JEST_IS_MONOREPO === 'true'
    ? {}
    : {
        collectCoverage: true,
        coverageReporters: ['json-summary', 'text', 'text-summary'],
        collectCoverageFrom: [
          'src/**/*.{ts,tsx}',
          '!**/*.test.{ts,tsx}',
          '!**/__tests__/**',
        ],
      }),
};
