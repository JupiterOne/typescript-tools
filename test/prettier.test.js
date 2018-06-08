const exec = require('child-process-promise').exec;
const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid/v4');

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

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const result = await fs.readFile(tempSrcFile, { encoding: 'utf8' });
  expect(result.trim()).toBe("console.log('Hello');");
});
