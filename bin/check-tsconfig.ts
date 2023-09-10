#!/usr/bin/env node

import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import yargs from 'yargs';

const input = yargs
  .option('h', {
    alias: 'help',
    type: 'boolean',
  })
  .option('husky', {
    type: 'boolean',
    description: 'Is this command being ran by husky?',
  })
  .option('quiet', {
    type: 'boolean',
    description: 'Use quiet mode? (no logs)',
  })
  .option('repair', {
    type: 'boolean',
    description: 'Should errors be fixed when possible?',
  })
  .option('monorepo', {
    type: 'boolean',
    description: 'Is this a monorepo? If so, packages will be checked',
  }).argv as {
  help?: boolean;
  husky?: boolean;
  quiet?: boolean;
  repair?: boolean;
  monorepo?: boolean;
  _: string[];
};

const isQuiet = input.quiet === true;
const isRepairEnabled = input.repair === true;
const isMonorepo = input.monorepo === true;

function log(msg: string) {
  if (isQuiet) {
    return;
  }
  console.log(msg);
}

async function readJsonFile<T>(file: string): Promise<T | undefined> {
  let contents: string;
  try {
    contents = await fs.readFile(file, { encoding: 'utf8' });
  } catch (err) {
    log(
      chalk.yellow(
        `Error reading ${chalk.bold(file)}. ${err.toString()} (skipping)`
      )
    );
    return undefined;
  }

  let obj;
  try {
    obj = JSON.parse(contents);
  } catch (err) {
    log(
      chalk.yellow(
        `Error parsing ${chalk.bold(file)}. ${err.toString()} (skipping)`
      )
    );
    return undefined;
  }

  return obj;
}

type PackageManifest = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type TSConfig = {
  references?: {
    path?: string;
  }[];
};

type PackageInfo = {
  packageName: string;
  dir: string;
  dirName: string;
  packageFile: string;
  packageObj: PackageManifest;
};

type CheckTSConfigStats = {
  problemFileCount: number;
};

async function checkTsConfigFile(options: {
  packageInfo: PackageInfo;
  stats: CheckTSConfigStats;
  tsconfigFile: string;
  tsconfigObj: TSConfig;
  expectedProjectReferences: Set<string>;
}) {
  const { packageInfo, stats, tsconfigFile, tsconfigObj } = options;
  const expected = options.expectedProjectReferences;
  const unexpected = new Set<string>();
  const missing = new Set<string>(expected);

  for (const ref of tsconfigObj.references ?? []) {
    if (ref.path) {
      if (expected.has(ref.path)) {
        log(chalk.gray(`  ✓ Already has ${ref.path}`));
        missing.delete(ref.path);
      } else {
        unexpected.add(ref.path);
      }
    }
  }

  if (unexpected.size) {
    log(
      chalk.yellow(
        `  ${chalk.bold(
          packageInfo.packageName
        )} has unexpected project references:\n${[...unexpected]
          .map((dep) => {
            return `    - ${JSON.stringify(dep)}\n`;
          })
          .join('')}`
      )
    );
  }

  if (missing.size) {
    log(
      chalk.yellow(
        `  ${chalk.bold(
          packageInfo.packageName
        )} is missing these project project references:\n${[...missing]
          .map((dep) => {
            return `    - ${JSON.stringify(dep)}\n`;
          })
          .join('')}`
      )
    );
  }

  if (!unexpected.size && !missing.size) {
    log(
      chalk.gray(
        `\n  ${chalk.bold.green('✓')} ${chalk.bold(
          packageInfo.packageName
        )} is good`
      )
    );
    return;
  }

  stats.problemFileCount++;

  if (isRepairEnabled) {
    const repairedReferences = [...expected].map((refPath) => {
      return {
        path: refPath,
      };
    });

    await fs.writeFile(
      tsconfigFile,
      JSON.stringify(
        {
          ...tsconfigObj,
          references: repairedReferences,
        },
        null,
        2
      ),
      { encoding: 'utf8' }
    );

    log(chalk.green(`  ${chalk.bold(packageInfo.packageName)} was repaired!`));
  }
}

async function checkMonorepo() {
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages: PackageInfo[] = [];

  const knownPackages: Record<string, PackageInfo> = {};
  const stats: CheckTSConfigStats = {
    problemFileCount: 0,
  };

  let packagesReadDirResult;

  try {
    packagesReadDirResult = await fs.readdir(packagesDir);
  } catch (err) {
    log(
      chalk.yellow(
        `Unable to read monorepo packages at ${chalk.bold(
          packagesDir
        )} (probably not a monrepo). Error: ${err.toString()} (skipping)`
      )
    );
    process.exitCode = 3;
    return;
  }

  for (const packageDirName of packagesReadDirResult) {
    const packageDir = path.join(packagesDir, packageDirName);
    const packageDirStat = await fs.stat(packageDir);
    if (!packageDirStat.isDirectory()) {
      continue;
    }

    const packageFile = path.join(packageDir, 'package.json');
    const packageObj = await readJsonFile<PackageManifest>(packageFile);
    if (!packageObj) {
      continue;
    }

    const packageName = packageObj.name;
    if (!packageName) {
      log(
        chalk.yellow(
          `Package name is missing in ${chalk.bold(packageFile)} (skipping)`
        )
      );
      continue;
    }

    if (knownPackages[packageName]) {
      log(
        chalk.yellow(
          `Duplicate package name encountered in ${chalk.bold(
            packageFile
          )} (aborting!)`
        )
      );
      process.exitCode = 1;
      return;
    }

    const packageInfo: PackageInfo = {
      packageName,
      dir: packageDir,
      dirName: packageDirName,
      packageFile,
      packageObj,
    };

    knownPackages[packageName] = packageInfo;
    packages.push(packageInfo);
  }

  for (const packageInfo of packages) {
    log(`\nChecking ${chalk.bold(packageInfo.dirName)}...`);

    const tsconfigDistFile = path.join(packageInfo.dir, 'tsconfig.dist.json');
    const tsconfigDistObj = await readJsonFile<TSConfig>(tsconfigDistFile);

    const tsconfigFile = path.join(packageInfo.dir, 'tsconfig.json');
    const tsconfigObj = await readJsonFile<TSConfig>(tsconfigFile);

    if (!tsconfigObj && !tsconfigDistObj) {
      console.log(
        `Package ${chalk.bold(
          packageInfo.dirName
        )} does not have tsconfig.json or tsconfig.dist.json (skipping)`
      );
      continue;
    }

    const requiredDependenciesSet = new Set<string>();

    const processDependencies = (dependencyNames: string[]) => {
      for (const dependencyName of dependencyNames) {
        if (knownPackages[dependencyName]) {
          requiredDependenciesSet.add(dependencyName);
        }
      }
    };

    if (packageInfo.packageObj.dependencies) {
      processDependencies(Object.keys(packageInfo.packageObj.dependencies));
    }

    if (packageInfo.packageObj.devDependencies) {
      processDependencies(Object.keys(packageInfo.packageObj.devDependencies));
    }

    const requiredDependencies = [...requiredDependenciesSet];
    if (requiredDependencies.length) {
      log(
        `  It depends on:\n${requiredDependencies
          .map((dep) => {
            return `    - ${dep}\n`;
          })
          .join('')}`
      );
    } else {
      log(
        chalk.gray(
          `  ${chalk.bold(packageInfo.packageName)} has no dependencies`
        )
      );
    }

    const expectedNonDist = new Set<string>(
      requiredDependencies.map((dep) => {
        const knownPackage = knownPackages[dep];
        return `../${knownPackage.dirName}/tsconfig.json`;
      })
    );

    const expectedDist = new Set<string>(
      requiredDependencies.map((dep) => {
        const knownPackage = knownPackages[dep];
        return `../${knownPackage.dirName}/tsconfig.dist.json`;
      })
    );

    if (tsconfigObj) {
      await checkTsConfigFile({
        expectedProjectReferences: expectedNonDist,
        packageInfo,
        stats,
        tsconfigFile,
        tsconfigObj,
      });
    }

    if (tsconfigDistObj) {
      await checkTsConfigFile({
        expectedProjectReferences: expectedDist,
        packageInfo,
        stats,
        tsconfigFile: tsconfigDistFile,
        tsconfigObj: tsconfigDistObj,
      });
    }
  }

  console.log(
    `\n${chalk.bold.green('Finished checking tsconfig.dist.json files.')}`
  );

  if (isRepairEnabled) {
    console.log(`  Number of files repaired: ${stats.problemFileCount}\n`);
  } else {
    console.log(`  Number of files with problems: ${stats.problemFileCount}\n`);
  }

  if (stats.problemFileCount && !isRepairEnabled) {
    console.error(
      chalk.bold.red(`Problems were found in tsconfig files (please review).\n`)
    );
    process.exitCode = 2;
  }
}

async function run() {
  if (input.help) {
    return yargs.showHelp();
  }

  if (isMonorepo) {
    await checkMonorepo();
  } else {
    console.log(`tsconfig checks are currently only supported for monorepos`);
  }
}

run().catch((err) => {
  console.error(
    chalk.red(chalk.bold('Error occurred. ') + (err.stack || err.toString()))
  );
});
