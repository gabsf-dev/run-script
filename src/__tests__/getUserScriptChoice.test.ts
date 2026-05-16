import { getUserScriptChoice } from '../utils/getUserScriptChoice';
import { TScripts } from '../types';
import { Mock } from 'vitest';
import { select } from '@inquirer/prompts';

vi.mock('@inquirer/prompts');

describe('getUserScriptChoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the selected script', async () => {
    const scripts: TScripts = { build: 'webpack', test: 'vi' };
    (select as Mock).mockResolvedValue('build');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('build');
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Select the script to run',
        choices: [
          { name: 'build  [webpack]', value: 'build' },
          { name: 'test  [vi]', value: 'test' },
        ],
      })
    );
  });

  it('should handle single script', async () => {
    const scripts: TScripts = { start: 'node index.js' };
    (select as Mock).mockResolvedValue('start');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('start');
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: [{ name: 'start  [node index.js]', value: 'start' }],
      })
    );
  });

  it('should handle multiple scripts', async () => {
    const scripts: TScripts = {
      build: 'webpack',
      test: 'vi',
      lint: 'eslint .',
      dev: 'webpack-dev-server',
    };
    (select as Mock).mockResolvedValue('test');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('test');
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: expect.arrayContaining([
          { name: 'build  [webpack]', value: 'build' },
          { name: 'test  [vi]', value: 'test' },
          { name: 'lint  [eslint .]', value: 'lint' },
          { name: 'dev  [webpack-dev-server]', value: 'dev' },
        ]),
      })
    );
  });

  it('should throw error when select prompt fails', async () => {
    const scripts: TScripts = { build: 'webpack' };
    (select as Mock).mockRejectedValue(new Error('Selection error'));

    await expect(getUserScriptChoice(scripts)).rejects.toThrow(
      'Selection error'
    );
  });
});
