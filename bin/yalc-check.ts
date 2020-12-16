#!/usr/bin/env node

import { readMonorepoPackagesForCli } from '~/src/readMonorepoPackagesForCli';
import * as yalc from 'yalc';
import path from 'path';

import yargs from 'yargs';
import { readJsonFileForCli } from '~/src/readJsonFileForCli';

const input = yargs
  .option('h', {
    alias: 'help',
    type: 'boolean',
  })
  .option('monorepo', {
    type: 'boolean',
    description: 'Is this a monorepo? If so, packages will be checked',
  })
  .option('verbose', {
    type: 'boolean',
  }).argv as {
  help?: boolean;
  monorepo?: boolean;
  verbose?: boolean;
  _: string[];
};

const isVerbose = input.verbose === true;

function checkPackage(packageDir: string) {
  if (isVerbose) {
    console.log(`Checking ${packageDir}...`);
  }
  yalc.checkManifest({
    workingDir: packageDir,
  });
  if (isVerbose) {
    console.log(`${packageDir} checked`);
  }
}
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

  for (const curPackage of packages) {
    checkPackage(curPackage.dir);
  }
}

async function checkSinglePackage() {
  const packageDir = process.cwd();

  const packageFile = path.join(packageDir, 'package.json');
  const packageManifest = await readJsonFileForCli(packageFile, console.log);
  if (!packageManifest) {
    process.exitCode = 1;
    return;
  }

  checkPackage(packageDir);
}

async function run() {
  if (input.help) {
    return yargs.showHelp();
  }

  await checkSinglePackage();

  if (input.monorepo) {
    await yalcPublishMonorepo();
  }
}

run().catch((err) => {
  console.error('Error occurred! ' + (err.stack || err.toString()));
});
