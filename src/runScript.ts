import {
  CONSOLE_GREEN,
  CONSOLE_RESET,
  getTrueObjectKey,
  getUserScriptChoice,
  logScriptsOptionsTable,
} from './utils';
import { execSync } from 'child_process';
import { TScripts } from './types';

interface IRunScriptOptions {
  withAi: boolean;
  onlyView: boolean;
}

export const runScript = async ({ withAi, onlyView }: IRunScriptOptions) => {
  try {
    if (withAi) {
      console.info('::: Running scripts with AI is not supported yet');
      return;
    }

    const actualFolderPath = process.cwd();

    const packageJson = require(`${actualFolderPath}/package.json`);
    const scripts = packageJson.scripts as TScripts;

    if (onlyView) {
      logScriptsOptionsTable(scripts);
      return;
    }

    const hasPackageLock = require('fs').existsSync(
      `${actualFolderPath}/package-lock.json`
    );
    const hasYarnLock = require('fs').existsSync(
      `${actualFolderPath}/yarn.lock`
    );

    if (!hasPackageLock && !hasYarnLock) {
      throw new Error('No lock file found');
    }

    const packageManager = {
      npm: hasPackageLock,
      yarn: hasYarnLock,
    };
    const userPackageManager = getTrueObjectKey(packageManager);

    const choicedScript = await getUserScriptChoice(scripts);

    const command = userPackageManager === 'npm' ? 'npm run' : 'yarn';
    console.info(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        `${command} ${choicedScript}` +
        CONSOLE_RESET
    );

    execSync(`${command} ${choicedScript}`, { stdio: 'inherit' });
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('No package.json found in the folder');
      return;
    }

    if (error.message === 'No lock file found') {
      console.error(
        '::: No lock file found. Please run `npm install` or `yarn install` before running scripts'
      );
      return;
    }

    if (
      error.message === "Prompt couldn't be rendered in the current environment"
    ) {
      console.error(
        "::: Prompt couldn't be rendered in the current environment"
      );
      return;
    }

    console.error('::: Unknown error occurred');
    console.error(error.message);
  }
};
