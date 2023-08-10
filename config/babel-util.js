function buildPresets(api) {
  return [
    [
      '@babel/preset-env',
      {
        targets: {
          node: api.env('test') ? 'current' : '18',
        },
      },
    ],
    ['@babel/preset-typescript', {}],
  ];
}

function buildPlugins(packageDir) {
  return [
    [
      'module-resolver',
      {
        extensions: ['.ts', '.js', '.json', '.tsx', '.jsx'],
        alias: {
          '~': packageDir || '.',
        },
      },
    ],
  ];
}

/**
 * This funciton is used to build config that is exported
 * by `babel.config.js` and `.babelrc.js`.
 *
 * ```js
 * const { buildBabelConfig } = require('@jupiterone/platform-sdk-framework-dev/config/babel');
 *
 * // Build config for `babel.config.js` at root of project
 * module.exports = buildBabelConfig();
 *
 * // Build config for `babel.config.js` at root of monorepo project
 * module.exports = buildBabelConfig({monorepo: true});
 *
 * // Build config for `.babelrc.js` in monorepo package
 * module.exports = buildBabelConfig({packageDir: __dirname});
 * ```
 */
exports.buildBabelConfig = function (options) {
  return (api) => {
    const babelConfig = {
      presets: buildPresets(api),
    };

    options = options || {};

    if (options.monorepo) {
      // Monorepos needs to specify the location of packages
      babelConfig.babelrcRoots = [
        // Keep the root as a root
        '.',

        // Also consider monorepo packages "root" and load their .babelrc.json files.
        './packages/*',
      ];
    } else {
      babelConfig.plugins = buildPlugins(options.packageDir);
    }

    return babelConfig;
  };
};
