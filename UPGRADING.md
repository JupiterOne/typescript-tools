# Upgrading

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
- <https://github.com/lifeomic/lambda-tools/pull/191>
- <https://www.npmjs.com/package/jest-circus>

This shouldn't break anyone, but bumping major versions since it is a
substantial change to how events/jest hooks are handled.

## v6.0.0

New linting rule `no-implicit-dependencies`. See
<https://palantir.github.io/tslint/rules/no-implicit-dependencies/>

Implicitly relied on dependencies will need to be added or an override for this
rule can be specific in `tslint.json`.
