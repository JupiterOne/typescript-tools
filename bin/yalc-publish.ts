#!/usr/bin/env node

import { readMonorepoPackagesForCli } from '~/src/readMonorepoPackagesForCli';
import * as yalc from 'yalc';
import path from 'path';
import chalk from 'chalk';
import os from 'os';

import yargs from 'yargs';
import { readJsonFileForCli } from '~/src/readJsonFileForCli';

const input = yargs
  .option('h', {
    alias: 'help',
    type: 'boolean',
  })
  .option('monorepo', {
    type: 'boolean',
    description: 'If so, then monorepo packages will be published',
  }).argv as {
  help?: boolean;
  monorepo?: boolean;
  _: string[];
};

async function yalcPublishMonorepo() {
  const packages = await readMonorepoPackagesForCli({
    log: (msg) => {
      console.log(msg);
    },
    rootDir: process.cwd(),
  });

  if (!packages.length) {
    process.exitCode = 1;
    return;
  }

  const resolutions: Record<string, string> = {};
  const homeDir = os.homedir();

  for (const curPackage of packages) {
    if (curPackage.packageManifest.private === true) {
      console.log(
        `\nSkipped ${chalk.bold(curPackage.dir)} because it is private`
      );
      continue;
    }

    if (!curPackage.packageManifest.version) {
      console.log(
        `\nSkipped ${chalk.bold(curPackage.dir)} because it has no version`
      );
      continue;
    }

    console.log(`\nPublishing ${chalk.bold(curPackage.dir)}...`);
    await yalc.publishPackage({
      push: true,
      workingDir: path.join(curPackage.dir, 'dist'),
      // yarn: true,
    });
    console.log(chalk.green(`Published ${chalk.bold(curPackage.dir)}`));

    resolutions[curPackage.packageName] = `file:${path.join(
      homeDir,
      '.yalc',
      'packages',
      curPackage.packageName,
      curPackage.packageManifest.version
    )}`;
  }

  console.log(
    `You can now run the following in other projects to use these packages:\n`
  );
  for (const curPackage of packages) {
    console.log(
      ` ${chalk.bold('>')} ${chalk.blue(
        `npx yalc add ${curPackage.packageName}`
      )}`
    );
  }

  console.log(
    chalk.bold('\nAdd the following to the package.json of target project:\n')
  );
  console.log(
    chalk.blue(`"resolutions": ${JSON.stringify(resolutions, null, 2)}\n`)
  );
}

async function publishSinglePackage() {
  const packageDir = process.cwd();

  const packageFile = path.join(packageDir, 'package.json');
  const packageManifest = await readJsonFileForCli(packageFile, console.log);
  if (!packageManifest) {
    process.exitCode = 1;
    return;
  }
  console.log(`\nPublishing ${chalk.bold(packageDir)}...`);
  await yalc.publishPackage({
    push: true,
    workingDir: packageDir,
  });
  console.log(chalk.green(`Published ${chalk.bold(packageDir)}`));

  console.log(
    `You can now run the following in other projects to use this package:\n`
  );
  console.log(
    ` ${chalk.bold('>')} ${chalk.blue(`npx yalc add ${packageManifest.name}`)}`
  );
  console.log('');
}

async function run() {
  if (input.help) {
    return yargs.showHelp();
  }

  if (input.monorepo) {
    await yalcPublishMonorepo();
  } else {
    await publishSinglePackage();
  }
}

run().catch((err) => {
  console.error('Error occurred! ' + (err.stack || err.toString()));
});
