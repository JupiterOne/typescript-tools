# v8.0.0

Use `jest-circus` for default test runner. For context, see links:

- https://github.com/facebook/jest/issues/8484
- https://github.com/lifeomic/lambda-tools/pull/191
- https://www.npmjs.com/package/jest-circus

This shouldn't break anyone, but bumping major versions since it is a
substantial change to how events/jest hooks are handled.

# v6.0.0

New linting rule `no-implicit-dependencies`. See
https://palantir.github.io/tslint/rules/no-implicit-dependencies/

Implicitly relied on dependencies will need to be added or an override for this
rule can be specific in `tslint.json`.
