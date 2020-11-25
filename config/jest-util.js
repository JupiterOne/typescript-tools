const path = require('path');
exports.buildJestConfig = function (options) {
  options = options || {};

  const jestConfig = {
    ...require('./jest'),
  };

  if (options.packageDir) {
    jestConfig.transform = {
      // The following transform will configure jest with `rootMode: "upward"`
      // which causes the <rootDir>/babel.config.js to be loaded which will
      // allow typescript files in all packages/* to be transformed automatically.
      // This allows you to run tests without having to compile all packages
      // beforehand.
      // NOTE: The value needs be a path to a JavaScript file.
      '\\.[jt]sx?$': path.join(__dirname, 'jest-package.transform.js'),
    };

    // The module name mapper is needed to support using
    // the "~" path alias for `jest.requireActual(...)` calls.
    // Due to limitations with how `jest.requireActual(...)` resolves packages.
    // You should always use paths that are relative to the root of the
    // monorepo.
    // For example:
    // ```js
    // const logging = jest.requireActual('~/packages/sdk-logging');
    // ```
    jestConfig.moduleNameMapper = {
      '~/(.*)$': `${path.normalize(path.join(options.packageDir, '../..'))}/$1`,
    };
  }

  return jestConfig;
};
