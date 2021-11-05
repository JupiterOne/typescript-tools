# TypeScript Tools

This Node.js package provides a baseline set of dependencies, configuration, and
scripts that can be used by other TypeScript projects.

This Node.js package is opinionated and comes bundled with the following
dependencies:

- `typescript`

- `prettier`

- `jest`

- `babel` (used by `jest` and for building/transpiling)

- `eslint`

- `husky` (allows you specify git hook scripts inside `.husky/` directory -
  [read more](#usage-husky-7))

- `commmitlint` (optionally require conventional commits -
  [read more](#usage-commitlint))

- `lint-staged` (used as a `precommit` hook to automatically reformat changed
  source files)

- `ttypescript` (allows transform plugins to be loaded from `tsconfig.json`)

## Migrating from Husky 4 to Husky 7:

If you've been using previous versions of Husky in your project, the newest
version of Husky requires some package maintenance to keep git hooks working
(and working better than previously):
[read more](#installation-/-upgrade-for-previous-projects)

## Helper Scripts

This package provides the following `bin` entries:

- `check-tsconfig`: Fix and, optionally, repair
  [project references](https://www.typescriptlang.org/docs/handbook/project-references.html)
  in `tsconfig.dist.json` files. Run `yarn check-tsconfig --help` for more
  information.

- `yalc-publish`: Use `yalc` to publish packages locally (better alternative to
  `yarn link`) Run `yarn yalc-publish --help` for more information.

- `yalc-check`: Checks `package.json` files to make sure there are no `.yalc`
  entries Run `yarn yalc-check --help` for more information.

It is recommended that you add helper scripts to projects using
`@jupiterone/typescript-tools`.

**For monorepo projects:**

```json
{
  "scripts": {
    "tsconfig:repair": "check-tsconfig --monorepo --repair",
    "tsconfig:check": "check-tsconfig --monorepo --no-repair",
    "yalc:publish": "yalc-publish --monorepo",
    "yalc:check": "yalc-check --monorepo"
  }
}
```

**For non-monorepo projects:**

```json
{
  "scripts": {
    "tsconfig:repair": "check-tsconfig --repair",
    "tsconfig:check": "check-tsconfig --no-repair",
    "yalc:publish": "yalc-publish",
    "yalc:check": "yalc-check"
  }
}
```

```sh
# Repair project references inside packages/*/tsconfig.dist.json files:
yarn check-tsconfig --monorepo --repair

# Check project references inside packages/*/tsconfig.dist.json files:
yarn check-tsconfig --monorepo

# Publish packages in your monorepo locally using yalc:
yalc-publish --monorepo

# Make sure package.json files do not contain local .yalc dependencies:
yalc-check --monorepo
```

For more information about `yalc`, visit:

<https://github.com/whitecolor/yalc>

### Compiling project

**For monorepo:**

```sh
# Update all project references so that they match interproject dependencies:
yarn check-tsconfig --monorepo --repair

# Now compile all packages using project references which allows the
# typescript compiler to compile your packages in the correct order
yarn ttsc -b `find ./packages -maxdepth 2 -name tsconfig.dist.json`
```

**For non-monorepo:**

```sh
# It is recommended to have a tsconfig.dist.json that excludes all test files
# and use that to compile your typescript files
yarn ttsc --declaration -p tsconfig.dist.json
```

## Usage: Prettier

Create `prettier.config.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/prettier');
```

Create `lint-staged.config.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/lint-staged');
```

Also, the following `.prettierignore` file is recommended:

```plain
dist/
work/
node_modules/
coverage/
package.json
```

If you would like to rewrite `../` style paths in imports to use `~/` then you
should modify your project's `lint-staged.config.js` file.

**NOTE:** This project also installs
[prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports)
which will automatically be loaded by `prettier` and it will be used to organize
imports.

**For monorepo:**

```js
// For monorepo
module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md}': [
    'prettier --write',
    'yarn rewrite-imports --monorepo --dir .',
  ],
};
```

**For non-monorepo project:**

```js
// For monorepo
module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md}': [
    'prettier --write',
    'yarn rewrite-imports --dir .',
  ],
};
```

## Usage: Jest

Create `jest.config.js` at root of your project and use the contents below.

**For monorepo:**

```javascript
module.exports = {
  ...require('@jupiterone/typescript-tools/config/jest-monorepo'),

  // Optionally, run some setup script before each test script
  setupFilesAfterEnv: ['./jest.setup.ts'],

  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!**/*.test.ts',
    '!**/__tests__/**',
  ],
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

**For non-monorepo:**

```javascript
module.exports = {
  ...require('@jupiterone/typescript-tools/config/jest'),

  // Optionally, run some setup script before each test script
  setupFilesAfterEnv: ['./jest.setup.ts'],

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

## Usage: Babel

Babel is used to convert `*.ts` files to `*.js` by stripping away type
information. It is used when running `jest` tests and it can also be used to
build files for the web, docker image, serverless function, etc. (when type
declaration files are not needed)

Create `babel.config.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/babel');
```

**For monorepo projects use the following in your root `babel.config.js` file:**

```javascript
const {
  buildBabelConfig,
} = require('@jupiterone/typescript-tools/config/babel-util');
module.exports = buildBabelConfig({ monorepo: true });
```

**In each of the monorepo packages, use the following in each of your
`packages/*/.babelrc.js` files:**

```javascript
const {
  buildBabelConfig,
} = require('@jupiterone/typescript-tools/config/babel-util');
module.exports = buildBabelConfig({ packageDir: __dirname });
```

## Usage: TypeScript

Create `tsconfig.json` at root of your project that contains the contents below.

**For monorepo:**

```json
{
  "extends": "./node_modules/@jupiterone/typescript-tools/config/typescript-node-monorepo",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist"
  },
  "include": [
    "*.js",
    "*.ts",
    "packages/*/*.js",
    "packages/*/*.ts",
    "packages/*/package.json",
    "packages/*/*/**/*.ts",
    "packages/*/*/**/*.json"
  ],
  "exclude": [
    "packages/*/dist/**/*",
    "packages/*/coverage/**/*",
    "**/bak/**/*",
    "**/*.bak/**/*"
  ]
}
```

Also, for every monorepo package use this in its `./packages/*/tsconfig.json`
file:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": ".",
    "baseUrl": "."
  },
  "include": ["package.json", "**/*.ts", "**/*.json"],
  "exclude": ["dist/**/*", "coverage/**/*", "**/bak/**/*", "**/*.bak/**/*"]
}
```

Also, for every monorepo package use this in its
`./packages/*/tsconfig.dist.json` file:

```json
{
  "extends": "./tsconfig.json",
  "exclude": [
    "dist/**/*",
    "coverage/**/*",
    "**/bak/**/*",
    "**/*.bak/**/*",
    "test/**",
    "**/*.test.ts",
    "**/__tests__/**/*.ts",
    "**/__mocks__/**/*.ts"
  ],
  "references": [
    ...
  ]
}
```

**For non-monorepo:**

Add this to `tsconfig.json` file at root of project:

```json
{
  "extends": "./node_modules/@jupiterone/typescript-tools/config/typescript-node",
  "compilerOptions": {
    "rootDir": ".",
    "baseUrl": ".",
    "outDir": "dist"
  },
  "include": [
    "src/**/*.ts",
    "tools/**/*.ts",
    "tools/*.js",
    "test/**/*.ts",
    "jest.*.ts",
    "jest.*.js",
    "*.config.js"
  ],
  "exclude": ["**/*.bak/**/*", "**/dist/**/*"]
}
```

Also, for _production_ builds use a `tsconfig.dist.json` file that excludes
tests:

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}
```

**NOTE:** Your config should contain `rootDir` and `baseUrl` because these paths
need to be relative to your `tsconfig.json` file and not the TypeScript
configuration file that we are extending.

**NOTE:** You may want to add `"skipLibCheck": true` to the `compilerOptions` if
you have installed third-party packages that have broken types.

**NOTE:** TypeScript doesn't use Node module resolution to find tsconfig.json
files for extending so we have to use a relative or absolute path. See
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

The current eslint configuration extends the following:

- [eslint:recommended](https://eslint.org/docs/rules/): Built-in ecommended
  rules for `eslint`.
- [@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs#recommended):
  Opionated rules that don't require type information.
- [@typescript-eslint/recommended-requiring-type-checking](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs#recommended-requiring-type-checking):
  Opionated rules that use typescript type information (requires
  `parserOptions.project` in `eslint` config).
- [prettier/@typescript-eslint](https://github.com/prettier/eslint-config-prettier):
  Disables rules that `prettier` will automatically fix.

After extending the configurations above, the following rule overrides are
provided by `@jupiterone/typescript-tools`:

- `@typescript-eslint/explicit-function-return-type": "off"`
- `@typescript-eslint/no-explicit-any": "off"`
- `@typescript-eslint/no-inferrable-types": "off"`
- `@typescript-eslint/no-non-null-assertion": "off"`
- `@typescript-eslint/no-require-imports": "off"`
- `@typescript-eslint/no-unused-vars": "off"`
- `@typescript-eslint/no-use-before-define": "off"`
- `@typescript-eslint/no-var-requires": "off"`
- `@typescript-eslint/no-unsafe-return": "off"`
- `@typescript-eslint/no-unsafe-call": "off"`
- `@typescript-eslint/restrict-plus-operands": "off"`
- `@typescript-eslint/restrict-template-expressions": "off"`
- `@typescript-eslint/no-unsafe-assignment": "off"`
- `@typescript-eslint/prefer-string-starts-ends-with": "off"`
- `@typescript-eslint/require-await": "off"`
- `@typescript-eslint/no-unsafe-member-access": "off"`
- `@typescript-eslint/unbound-method": "off"`
- `@typescript-eslint/explicit-module-boundary-types": "off"`

See
<https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin>
for documentation on eslint rules for typescript.

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
  "extends": ["@jupiterone/eslint-config"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  }
}
```

**IMPORTANT:** If you are linting `*.js` files (which are enabled by via `--ext`
argument) then make sure `allowJs: true` is set in your `tsconfig.json`, and
also make sure the `*.js` files are included via the `include`/`exclude`
patterns in your `tsconfig.json` files. If the typescript compiler does not
process the `*.js` files then you'll see eslint errors similar to the following:

```
/Development/my-project/my-file.js
  0:0  error  Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.
The file does not match your project config: my-file.js.
The file must be included in at least one of the projects provided
```

### ESLint configuration for React

Create `.eslintrc` at root of your project that contains:

```json
{
  "root": true,
  "extends": ["@jupiterone/eslint-config/react"]
}
```

## Usage: Husky 7

In the updates to Husky for major version 7 they have included some large
changes that fix existing Husky problems. (Most of these problems revolved
around failing to properly bootstrap a new cloned project with `.git/hooks`
entries and the inability to run hooks without first loading the `node.js`
runtime [due to looking in many different places for a JS config that must be
added to the `.git/hooks` directory])

A writeup by the Husky authors
[can be read here](https://blog.typicode.com/husky-git-hooks-javascript-config/).
Summarized major changes for our use-case are as follows:

- No more `.huskyrc` and no more `[package.json].husky` entries. (Husky is
  configuring Git with shell scripts now, we don't want JS configs)

- Hooks now live in a directory specified by `git config` at the
  `core.hooksPath` directory

  - Husky will try to set the above path automatically on `prepare`

- Maintenance needed to upgrade existing hooks to the new format:

### Installation / Upgrade for Previous Projects

- <b>[Instructions to migrate](https://github.com/typicode/husky-4-to-7) from v4
  to v7 automatically</b>

  From the above link:

  ```bash
  yarn add husky@latest --dev \
  && npx husky-init \
  && npm exec -- github:typicode/husky-4-to-7 --remove-v4-config
  ```

The above instructions basically just remove the `.git/hooks` entries, creates a
`.husky` directory, and executes
`npx husky add .husky/<my-hook> '<My Hook Contents>` for each hook in the
previous format -- you are free to set up the hooks each on their own, but the
aforementioned script will attempt to convert the old format to the Husky 7.x
format.

### Recommended Hooks

Standard set of Jupiter One hooks are configured as follows, after installing
Husky:

```bash
npx husky add .husky/pre-commit 'yarn lint-staged && yarn format'
npx husky add .husky/pre-push 'yarn test:ci'
```

and if following `Conventional Commits` (with a
[commitlint config](#usage-commitlint)):

```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

The above pattern can be used to add hooks for any of the supported git-hooks.

## Usage: Commitlint

[Commitlint](https://github.com/conventional-changelog/commitlint) is a package
to enforce that users execute git commits with their messages complying to the
[conventional commit standard](https://www.conventionalcommits.org/en/v1.0.0/).
It's entirely optional to enable on a package currently-- to do so, just place a
`commitlint.config.js` file at your project root, and either configure
independently, or import a common config from this repository. For convenience a
`lerna-monorepo` style commitlint.config.js is exported from the config
directory.

Example configuration for a Lerna-maintained monorepo with Conventional Commits:

```javascript
module.exports = {
  extends: ['@jupiterone/typescript-tools/config/commitlint-monorepo'],
};
```
