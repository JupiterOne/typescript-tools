# TypeScript Tools

This Node.js package provides a baseline set of dependencies, configuration, and
scripts that can be used by other TypeScript projects.

This Node.js package is opinionated and comes bundles with the following
dependencies:

- `typescript`

- `prettier`

- `jest`

- `eslint`

- `husky` (allows you specify git hook scripts in your `package.json`)

- `lint-staged` (used as a `precommit` hook to automatically reformat changed
  source files)

## Usage: Prettier

Create `prettier.config.js` at root of your project that contains:

```javascript
module.exports = require('@lifeomic/typescript-tools/config/prettier');
```

Create `lint-staged.config.js` at root of your project that contains:

```javascript
module.exports = require('@lifeomic/typescript-tools/config/lint-staged');
```

Create `.huskyrc.js` at root of your project that contains:

```javascript
module.exports = require('@lifeomic/typescript-tools/config/husky');
```

Also, the following `.prettierignore` file is recommended:

```plain
dist/
work/
node_modules/
coverage/
package.json
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
      lines: 100,
    },
  },
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

**NOTE:** Your config should contain `rootDir` and `baseUrl` because these paths
need to be relative to your `tsconfig.json` file and not the TypeScript
configuration file that we are extending.

**NOTE:** TypeScript doesn't use Node module resolution so we have to use a
relative or absolute path. See
<https://github.com/Microsoft/TypeScript/issues/18865>

**To perform type-checking:**

```bash
yarn type-check
```

**NOTE:** `type-check` utility script runs `tsc --noEmit`.

## Usage: ESLint

This package contains `eslint` configuration for both backend (Node.js) and
frontend (React) so pick the configuration that is appropriate for your project.

Regardless of target environment, you can always add `.eslintignore` to ignore
certain files in your project.

The current eslint configuration is based on
[eslint:recommended](https://eslint.org/docs/rules/) except formatting rules are
removed using the `eslint-config-prettier` config since we are using `prettier`
to automatically format code.

Run `eslint` using the following command:

```sh
yarn eslint --ext .ts,.tsx.js,.jsx .
```

In your `package.json` add the following to the `scripts` section:

```json
"lint": "eslint --ext .ts,.tsx,.js,.jsx ."
```

**IMPORTANT:** You currently must explicitly add the `--ext` argument because
`eslint` will only check `.js` files by default and you can't control this from
the eslint configuration.

### ESLint configuration for Node.js

Create `.eslintrc` at root of your project that contains:

```json
{
  "root": true,
  "extends": [
    "./node_modules/@lifeomic/typescript-tools/config/eslint-node.json"
  ]
}
```

### ESLint configuration for React

Create `.eslintrc` at root of your project that contains:

```json
{
  "root": true,
  "extends": [
    "./node_modules/@lifeomic/typescript-tools/config/eslint-react.json"
  ]
}
```

## Usage: Publishing Node.js Package

If your build output will be published as an NPM package, the following
`tsconfig.json` is recommended:

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

Your project's `Jenkinsfile` should contain the following command in the
`publish` stage:

```bash
./node_modules/@lifeomic/dev-tools/bin/lifeomic-publish-npm-package --directory ./dist --publish-tagged-commits-only
```
