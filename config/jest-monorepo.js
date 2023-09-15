process.env.JEST_IS_MONOREPO = 'true';

module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/packages/*/{src,test}/**/*.test.{ts,tsx}'],
  projects: ['<rootDir>/packages/*'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json-summary', 'text', 'text-summary'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
};
