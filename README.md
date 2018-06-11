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

## Usage: Jest

Create `jest.config.js` at root of your project that contains:

```javascript
module.exports = {
  ...require('@lifeomic/typescript-tools/config/jest'),
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
  "extends": "./node_modules/@lifeomic/typescript-tools/config/typescript"
}
```

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

## Usage: Build All Lambdas

**Use the following command to create zip files for each lambda function:**

```bash
lambda-tools-build -z -s ${npm_package_name} -n 8.10 -o ./deploy/terraform/dist/lambdas ./src/lambdas/
```
