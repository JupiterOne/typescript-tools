import { LogFunc } from '~/src/types';
import chalk from 'chalk';
import { promises as fs } from 'fs';

export async function readJsonFileForCli<
  T = Record<string, unknown>,
>(file: string, log: LogFunc): Promise<T | undefined> {
  let contents: string;
  try {
    contents = await fs.readFile(file, { encoding: 'utf8' });
  } catch (err: unknown) {
    log(
      chalk.yellow(
        `Error reading ${chalk.bold(file)}. ${String(err)} (skipping)`
      )
    );
    return undefined;
  }

  let obj: T;
  try {
    obj = JSON.parse(contents) as T;
  } catch (err: unknown) {
    log(
      chalk.yellow(
        `Error parsing ${chalk.bold(file)}. ${String(err)} (skipping)`
      )
    );
    return undefined;
  }

  return obj;
}
