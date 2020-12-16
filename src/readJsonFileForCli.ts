import { LogFunc } from '~/src/types';
import chalk from 'chalk';
import { promises as fs } from 'fs';

export async function readJsonFileForCli(file: string, log: LogFunc) {
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
