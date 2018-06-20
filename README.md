# TypeScript Tools

This Node.js package provides a baseline set of dependencies, configuration,
and scripts that can be used by other TypeScript projects.

This Node.js package is opinionated and comes bundles with the following
dependencies:

- `typescript`

- `prettier`

- `jest`

- `tslint`

- `husky` (allows you specify git hook scripts in your `package.json`)

- `lint-staged` (used as a `precommit` hook to automatically reformat
  changed source files)

## Usage: Prettier

Create `prettier.config.js` at root of your project that contains:

```javascript
module.exports = require('@lifeomic/typescript-tools/config/prettier');
```

Create `lint-staged.config.js` at root of your project that contains:

```javascript
module.exports = require('@lifeomic/typescript-tools/config/lint-staged');
```

Modify your `package.json` to include the following:

```json
  "scripts": {
    ...
    "precommit": "lint-staged"
  }
```

Also, the following `.prettierignore` file is recommended:

```plain
dist/
work/
node_modules/
coverage/
```

## Usage: Jest

Create `jest.config.js` at root of your project that contains:

```javascript
module.exports = {
  ...require('@lifeomic/typescript-tools/config/jest'),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
};
```

## Usage: TypeScript

Create `tsconfig.json` at root of your project that contains:

```json
{
  "extends": "./node_modules/@lifeomic/typescript-tools/config/typescript",
  "compilerOptions": {
    "rootDir": ".",
    "baseUrl": "."
  }
}
```

**NOTE:** Your config should contain `rootDir` and `baseUrl` because these
paths need to be relative to your `tsconfig.json` file and not the TypeScript
configuration file that we are extending.

**NOTE:** TypeScript doesn't use Node module resolution so we have to
use a relative or absolute path. See
<https://github.com/Microsoft/TypeScript/issues/18865>

**To perform type-checking:**

```bash
yarn type-check
```

**NOTE:** `type-check` utility script runs `tsc --noEmit`.

## Usage: tslint

Create `tslint.json` at root of your project that contains:

```json
{
  "extends": ["@lifeomic/typescript-tools/config/tslint"]
}
```

## Usage: Publishing Node.js Package

If your build output will be published as an NPM package,
the following `tsconfig.json` is recommended:

```plain
{
  "extends": "./node_modules/@lifeomic/typescript-tools/config/typescript",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "module": "CommonJS"
  },
  "include": ["src/**/*"]
}
```

The following `.npmignore` file is recommended:

```plain
*.test.js
*.test.d.ts
```

Your project's `Jenkinsfile` should contain the following command
in the `publish` stage:

```bash
./node_modules/@lifeomic/dev-tools/bin/lifeomic-publish-npm-package --directory ./dist --publish-tagged-commits-only
```

## Usage: Build All Lambdas

**Use the following command to create zip files for each lambda function:**

```bash
lambda-tools-build -z -s ${npm_package_name} -n 8.10 -o ./deploy/terraform/dist/lambdas ./src/lambdas/
```

## Usage: Using `~` for Paths Relative to Root

Add the following `webpack-transform.js` file to the root of your project:

```js
module.exports = webpackConfig => {
  // Add a resolve alias for `~` which allows us to reference
  // source files relative to the root (e.g. `~/src/logging`)
  const resolve = webpackConfig.resolve || (webpackConfig.resolve = {});
  resolve.alias = {
    '~': __dirname
  };

  return webpackConfig;
};
```

Modify your `lifeomic-tools-build` command to use this `webpack-transform.js`
file with the `-w` argument:

For example:

```bash
lambda-tools-build -z -s ${npm_package_name} -n 8.10 -w ./webpack-transform.js -o ./deploy/terraform/dist/lambdas ./src/lambdas/
```

Modify your `jest.config.js` to use a `moduleNameMapper`:

```js
module.exports = {
  ...require('@lifeomic/typescript-tools/config/jest'),
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/$1'
  }
};
```

If you plan on using `ts-node` to run your TypeScript code without
compiling it, then add `require-self-ref` to your project as a dev dependency:

```js
yarn add require-self-ref --dev
```

In each of your entrypoints for your tools or helper scripts
add the following to the entrypoint file:

```js
require('require-self-ref');
```

## Usage: Accessing `@lifeomic/lambda-tools` API

The `@lifeomic/typescript-tools` module exposes the JavaScript API
implemented in `@lifeomic/lambda-tools`.

If you need to access the `@lifeomic/lambda-tools` JavaScript API,
use the following code:

```js
const lambdaTools = require('@lifeomic/typescript-tools/lambda-tools');

// You can now use one of the following properties:
// `lambdaTools.docker`
// `lambdaTools.dynamodb`
// `lambdaTools.graphql`
// `lambdaTools.lambda`
```
