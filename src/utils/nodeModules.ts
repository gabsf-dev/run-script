import { confirm } from '@inquirer/prompts';

export const hasNodeModules = (): boolean => {
  const fs = require('fs');
  return fs.existsSync('node_modules');
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
