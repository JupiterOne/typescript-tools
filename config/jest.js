module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/{src,test}/**/*.test.{ts,tsx}'],
  // process.env.JEST_IS_MONOREPO is set to 'true' when project loads
  // @jupiterone/typescript-tools/config/jest-monorepo file for configuring
  // monorepo to use `jest`.
  ...(process.env.JEST_IS_MONOREPO === 'true'
    ? // If this config is for a package/project within a monorepo then we
      // don't include the coverage configuration properties because they
      // will produce jest config validation warnings.
      // The coverage-related properties should exist at the root jest.config.js
      // file for a monorepo (not within the packages/*/jest.config.js files).
      {}
    : // If this is not a monorepo, then include the coverage-related
      // configuration properties.
      {
        coverageDirectory: '<rootDir>/coverage',
        collectCoverage: true,
        coverageReporters: ['json-summary', 'text', 'text-summary'],
        collectCoverageFrom: [
          'src/**/*.{ts,tsx}',
          '!**/*.test.{ts,tsx}',
          '!**/__tests__/**',
        ],
      }),
};
