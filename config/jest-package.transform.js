module.exports = require('babel-jest').default.createTransformer({
  // The "upward" root mode will cause the babel configuration from the root
  // of the project to be used when configuring babel within a package.
  rootMode: 'upward',
});
