# Upgrading

## v9.0.0

Version `v9.x.x` of this package makes `eslint` the preferred linter since
`tslint` is now deprecated. The `eslint` rules will probably not match the old
`tslint` rules exactly but we can continue to tweak these or provide a separate
config or plugin package for better control.

- Remove `tslint` from your project since `tslint` is deprecated
  - Remove `tslint.json`
- Change your linting command to `eslint .`
  - For example, in `package.json` use `"lint": "eslint ."`
- Follow instructions for **Usage: eslint** in the README.md.

**NOTE:** `tslint` will be removed completely in a future version of
`@lifeomic/typescript-tools` so please start switching to `eslint`.

## v8.0.0

Use `jest-circus` for default test runner. For context, see links:

- https://github.com/facebook/jest/issues/8484
- https://github.com/lifeomic/lambda-tools/pull/191
- https://www.npmjs.com/package/jest-circus

This shouldn't break anyone, but bumping major versions since it is a
substantial change to how events/jest hooks are handled.

## v6.0.0

New linting rule `no-implicit-dependencies`. See
<https://palantir.github.io/tslint/rules/no-implicit-dependencies/>

Implicitly relied on dependencies will need to be added or an override for this
rule can be specific in `tslint.json`.
