import { execSync } from 'child_process';
import { CONSOLE_GREEN, CONSOLE_RESET, ERROR_MESSAGES } from './constants';
import { getRunCommand } from './getRunCommand';
import { getUserScriptChoice } from './getUserScriptChoice';
import { logScriptsOptionsTable } from './logScripts';
import { hasNodeModules, promptInstallNodeModules } from './nodeModules';
import { checkPackageJsonExists, getPackageJsonScripts } from './packageJson';
import { handleErrors } from './handleErrors';

interface IRunScriptOptions {
  onlyView: boolean;
}

export const runScript = async ({ onlyView }: IRunScriptOptions) => {
  try {
    const actualFolderPath = process.cwd();

    if (!checkPackageJsonExists(actualFolderPath)) {
      throw new Error(ERROR_MESSAGES.NO_PACKAGE_JSON);
    }

    const scripts = getPackageJsonScripts(actualFolderPath);

    if (onlyView) {
      logScriptsOptionsTable(scripts);
      return;
    }

    const choicedScript = await getUserScriptChoice(scripts);

    const { command, args } = await getRunCommand(choicedScript);

    if (!hasNodeModules()) {
      const installNodeModules = await promptInstallNodeModules();

      if (installNodeModules) {
        console.info('\n::: Installing node modules...');
        execSync(`${command} install`, { stdio: 'inherit' });
      }
    }

    console.info(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        `${command} ${args.join(' ')}` +
        CONSOLE_RESET +
        '\n'
    );

    execSync(`${command} ${args.join(' ')}`, { stdio: 'inherit' });
  } catch (error: any) {
    handleErrors(error);
  }
};
