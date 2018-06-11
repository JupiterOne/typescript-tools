const lambdaTools = require('../lambda-tools');

test('@lifeoic/lambda-tools is properly exported from @lifeomic/typescript-tools', async () => {
  expect(lambdaTools.docker).toBeDefined();
  expect(lambdaTools.dynamodb).toBeDefined();
  expect(lambdaTools.graphql).toBeDefined();
  expect(lambdaTools.lambda).toBeDefined();
});
