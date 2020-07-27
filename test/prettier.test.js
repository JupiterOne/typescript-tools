const exec = require('child-process-promise').exec;
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

test('prettier should replace double quotes with single quotes', async () => {
  const tempSrcFile = path.join(
    __dirname,
    `work/fixtures/prettier-double-quotes-${uuid()}.ts`
  );
  await fs.copy(
    path.join(__dirname, 'fixtures/prettier-double-quotes.ts.orig'),
    tempSrcFile
  );

  await exec(`yarn run prettier --write ${tempSrcFile}`);

  const result = await fs.readFile(tempSrcFile, { encoding: 'utf8' });
  expect(result.trim()).toBe("console.log('Hello');");
});
