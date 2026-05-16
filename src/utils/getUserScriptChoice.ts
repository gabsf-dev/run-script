import { TScripts } from '../types';
import { select } from '@inquirer/prompts';

export const getUserScriptChoice = async (scripts: TScripts) => {
  const scriptChoices = Object.keys(scripts).map((script) => ({
    name: `${script}  [${scripts[script]}]`,
    value: script,
  }));

  const selectedScript = await select({
    message: 'Select the script to run',
    choices: scriptChoices,
  });

  return selectedScript;
};
