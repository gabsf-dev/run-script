import { confirm } from '@inquirer/prompts';
import { existsSync } from 'fs';

export const hasNodeModules = (): boolean => {
  return existsSync('node_modules');
};

export const promptInstallNodeModules = async (): Promise<boolean> => {
  try {
    const install = await confirm({
      message:
        'No node_modules found. Do you want to install dependencies now?',
      default: true,
    });

    return install;
  } catch (error) {
    return false;
  }
};
