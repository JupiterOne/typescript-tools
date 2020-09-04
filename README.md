# TypeScript Tools

This Node.js package provides a baseline set of dependencies, configuration, and
scripts that can be used by other TypeScript projects.

This Node.js package is opinionated and comes bundles with the following
dependencies:

- `typescript`

- `prettier`

- `jest`

- `babel` (used by `jest` and for building/transpiling)

- `eslint`

- `husky` (allows you specify git hook scripts in your `package.json`)

- `lint-staged` (used as a `precommit` hook to automatically reformat changed
  source files)

- `ttypescript` (allows transform plugins to be loaded from `tsconfig.json`)

## Usage: Prettier

Create `prettier.config.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/prettier');
```

Create `lint-staged.config.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/lint-staged');
```

Create `.huskyrc.js` at root of your project that contains:

```javascript
module.exports = require('@jupiterone/typescript-tools/config/husky');
```

Also, the following `.prettierignore` file is recommended:

```plain
dist/
work/
node_modules/
coverage/
package.json
```

If you would like to rewrite `../` style paths in imports to use `~/` then use
the following `.huskyrc.js`

```json
{
  "precommit": "yarn rewrite-imports --dir . && lint-staged"
}
```

## Usage: Jest

Create `jest.config.js` at root of your project that contains:

```javascript
module.exports = {
  ...require('@jupiterone/typescript-tools/config/jest'),
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

## Usage: TypeScript

Create `tsconfig.json` at root of your project that contains:

For

```json
{
  "extends": "./node_modules/@jupiterone/typescript-tools/config/typescript",
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
  "extends": [
    "./node_modules/@jupiterone/typescript-tools/config/eslint-node.json"
  ],
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
  "extends": [
    "./node_modules/@jupiterone/typescript-tools/config/eslint-react.json"
  ]
}
```
