# Upgrading

## v12.0.0

The out-of-the-box typescript configuration in `@jupiterone/typescript-tools`
supports using paths prefixed with `~` as an alias to the project root.

For example, you can use the following `import`:

```typescript
`import { doSomething } from '~/src/util'`;
```

You can use the following command to rewrite your `*.ts` files to use the
preferred `import` path syntax by running:

```sh
yarn rewrite-imports --dir .
```

For Node.js projects, modify your `tsconfig.json` to use:

```
"extends": "./node_modules/@jupiterone/typescript-tools/config/typescript-node12"
```

The Node.js configuration uses the `ES2019` target per instructions at
<https://www.typescriptlang.org/tsconfig#target>.

Add `babel.config.js` to the root of your project (see README.md for additional
instructions).

Most projects can use a `jest.config.js` similar to the following:

```javascript
module.exports = {
  ...require('@jupiterone/typescript-tools/config/jest'),
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/logging.ts'],

  // Default thresholds are at 100% code coverage but these can be adjusted
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
};
```

If you are building a shareable package use the following command to compile
your typescript files:

```sh
yarn ttsc --declaration -p tsconfig.dist.json
```

If you are building a lambda function and you don't need the `*.d.ts` files then
you can use the following command:

```sh
yarn babel . --extensions '.ts' --only 'src/' --out-dir './dist'
```

## v11.0.0

The base typescript config now uses `ES2019` as the target.

In version `v10.0.0` of `@jupiterone/typescript-tools` "floating promises" were
not linted properly because rules that required type information were not
enabled. This is fixed in `v11.0.0` and higher of
`@jupiterone/typescript-tools`.

The tsconfig option `allowJs` is now `true` by default to enable eslint type
checking in these files.

The eslint configuration now enables rules that require type information. These
rules can be found here:

<https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.ts>

To support these rules, modify your `.eslintrc` to have `parserOptions` as shown
in example below:

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

## v10.0.0

Version `v10` upgrades to `prettier` 2.0. When formatting code you will see
minor differences in how lines are wrapped and where spacing is added.

`prettier` 2.0 also supports typescript 3.8+ which means that it will support
newer language features such as `import type`.

Full details about `prettier` 2.0 are described here:

<https://prettier.io/blog/2020/03/21/2.0.0.html>

**TIP:**

The formatting changes might affect most files so it is recommended to run
`prettier --write '**/*.{js,ts,md,json}'` in a branch and have those changes
reviewed separately from other changes.

## v9.0.0

Version `v9.x.x` of this package makes `eslint` the preferred linter since
`tslint` is now deprecated. The `eslint` rules will probably not match the old
`tslint` rules exactly but we can continue to tweak these or provide a separate
config or plugin package for better control.

- Remove `tslint.json` from your project since `tslint` is deprecated
- Change your linting command to use `eslint`
  - For example, in `package.json` use
    `"lint": "eslint --ext .ts,.tsx,.js,.jsx ."` (make sure you add the `--ext`
    argument!)
- Follow instructions for **Usage: ESLint** in the README.md.

## v8.0.0

Use `jest-circus` for default test runner. For context, see links:

- <https://github.com/facebook/jest/issues/8484>
- <https://github.com/jupiterone/lambda-tools/pull/191>
- <https://www.npmjs.com/package/jest-circus>

This shouldn't break anyone, but bumping major versions since it is a
substantial change to how events/jest hooks are handled.

## v6.0.0

New linting rule `no-implicit-dependencies`. See
<https://palantir.github.io/tslint/rules/no-implicit-dependencies/>

Implicitly relied on dependencies will need to be added or an override for this
rule can be specific in `tslint.json`.
