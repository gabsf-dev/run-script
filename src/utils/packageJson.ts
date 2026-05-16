import { TScripts } from '../types';

export const checkPackageJsonExists = (path: string): boolean => {
  return require('fs').existsSync(`${path}/package.json`);
};

export const getPackageJsonVersion = () => {
  return require('../../package.json').version;
};

export const getPackageJsonScripts = (actualFolderPath: string): TScripts => {
  const packageJson = require(`${actualFolderPath}/package.json`);
  return packageJson.scripts as TScripts;
};
