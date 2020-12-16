import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { readJsonFileForCli } from '~/src/readJsonFileForCli';
import { LogFunc, PackageInfo, PackageManifest } from '~/src/types';

export async function readMonorepoPackagesForCli(options: {
  rootDir: string;
  log: LogFunc;
}): Promise<PackageInfo[]> {
  const { rootDir, log } = options;
  const packagesDir = path.join(rootDir, 'packages');
  const packages: PackageInfo[] = [];

  const knownPackages: Record<string, PackageInfo> = {};

  let packagesReadDirResult;

  try {
    packagesReadDirResult = await fs.readdir(packagesDir);
  } catch (err) {
    log(
      chalk.yellow(
        `Unable to read monorepo packages at ${chalk.bold(
          packagesDir
        )} (probably not a monorepo). Error: ${err.toString()} (skipping)`
      )
    );
    return packages;
  }

  for (const packageDirName of packagesReadDirResult) {
    const packageDir = path.join(packagesDir, packageDirName);
    const packageDirStat = await fs.stat(packageDir);
    if (!packageDirStat.isDirectory()) {
      continue;
    }

    const packageFile = path.join(packageDir, 'package.json');
    const packageManifest: PackageManifest = await readJsonFileForCli(
      packageFile,
      log
    );
    if (!packageManifest) {
      continue;
    }

    const packageName = packageManifest.name;
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
      throw new Error(`Duplicate packages found (aborting!)`);
    }

    const packageInfo: PackageInfo = {
      packageName,
      dir: packageDir,
      dirName: packageDirName,
      packageFile,
      packageManifest,
    };
    packages.push(packageInfo);
  }

  return packages;
}
