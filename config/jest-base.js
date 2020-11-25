module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'node',
  // Ignore "dist" directories to prevent the following warning:
  // jest-haste-map: Haste module naming collision: @jupiterone/platform-sdk-logging
  // The following files share their name; please adjust your hasteImpl:
  // <rootDir>/package.json
  // <rootDir>/dist/package.json
  modulePathIgnorePatterns: ['dist/', 'bak/'],

  // The module name mapper is needed to support using
  // the "~" path alias for `jest.requireActual(...)` calls.
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/$1',
  },
};
