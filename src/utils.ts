import { Table } from 'console-table-printer';
import { TScripts } from './types';
import inquirer from 'inquirer';

export const getPackageJsonVersion = () => {
  return require('../package.json').version;
};

type TObj = {
  [key: string]: boolean;
};

export const getTrueObjectKey = (obj: TObj) => {
  return Object.keys(obj).find((key) => obj[key]);
};

export const logScriptsOptionsTable = (scripts: TScripts) => {
  const p = new Table({
    columns: [
      { name: 'script', alignment: 'left', color: 'blue' },
      { name: 'command', alignment: 'left', color: 'green' },
    ],
  });

  Object.entries(scripts).forEach(([key, value]) =>
    p.addRow({ script: key, command: value })
  );

  p.printTable();
};

export const getUserScriptChoice = async (scripts: TScripts) => {
  const scriptChoices = Object.keys(scripts).map((script) => ({
    name: `${script}  [${scripts[script]}]`,
    value: script,
  }));

  return new Promise<string>((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'script',
          message: 'Select the script to run',
          choices: scriptChoices,
        },
      ])
      .then((answers) => {
        const script = answers.script;
        resolve(script);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const CONSOLE_GREEN = '\u001b[32m';
export const CONSOLE_RESET = '\u001b[0m';
