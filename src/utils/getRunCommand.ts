import { confirm } from '@inquirer/prompts';
import { detect, resolveCommand } from 'package-manager-detector';
import { ERROR_MESSAGES } from './constants';

export async function getRunCommand(
  script: string
): Promise<{ command: string; args: string[] }> {
  const pm = await detect({
    strategies: ['lockfile', 'packageManager-field', 'devEngines-field'],
  });

  if (!pm) {
    // fallback to npm if user choose to it
    const useNpm = await promptUseNpm();

    if (useNpm) {
      return { command: 'npm', args: ['run', script] };
    }

    throw new Error(ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER);
  }

  const resolved = resolveCommand(pm.agent, 'run', [script]);

  if (!resolved) {
    throw new Error(`Comando 'run' não suportado para ${pm.agent}`);
  }

  return resolved; // ex: { command: 'pnpm', args: ['run', 'dev'] }
}

const promptUseNpm = async (): Promise<boolean> => {
  try {
    const useNpm = await confirm({
      message:
        'Could not detect a package manager. Do you want to use npm to run the script?',
      default: true,
    });

    return useNpm;
  } catch (error) {
    return false;
  }
};
