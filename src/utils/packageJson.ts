import type { TScripts } from '../types';
import { existsSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const checkPackageJsonExists = (path: string): boolean => {
  return existsSync(`${path}/package.json`);
};

export const getPackageJsonVersion = () => {
  return require('../../package.json').version;
};

export const getPackageJsonScripts = (actualFolderPath: string): TScripts => {
  const packageJson = require(`${actualFolderPath}/package.json`);
  return packageJson.scripts as TScripts;
};
