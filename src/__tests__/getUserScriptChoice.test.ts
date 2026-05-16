import { getUserScriptChoice } from '../utils/getUserScriptChoice';
import { TScripts } from '../types';

jest.mock('@inquirer/prompts');

describe('getUserScriptChoice', () => {
  let mockSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const inquirer = require('@inquirer/prompts');
    mockSelect = inquirer.select;
  });

  it('should return the selected script', async () => {
    const scripts: TScripts = { build: 'webpack', test: 'jest' };
    mockSelect.mockResolvedValue('build');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('build');
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Select the script to run',
        choices: [
          { name: 'build  [webpack]', value: 'build' },
          { name: 'test  [jest]', value: 'test' },
        ],
      })
    );
  });

  it('should handle single script', async () => {
    const scripts: TScripts = { start: 'node index.js' };
    mockSelect.mockResolvedValue('start');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('start');
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: [{ name: 'start  [node index.js]', value: 'start' }],
      })
    );
  });

  it('should handle multiple scripts', async () => {
    const scripts: TScripts = {
      build: 'webpack',
      test: 'jest',
      lint: 'eslint .',
      dev: 'webpack-dev-server',
    };
    mockSelect.mockResolvedValue('test');

    const result = await getUserScriptChoice(scripts);

    expect(result).toBe('test');
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: expect.arrayContaining([
          { name: 'build  [webpack]', value: 'build' },
          { name: 'test  [jest]', value: 'test' },
          { name: 'lint  [eslint .]', value: 'lint' },
          { name: 'dev  [webpack-dev-server]', value: 'dev' },
        ]),
      })
    );
  });

  it('should throw error when select prompt fails', async () => {
    const scripts: TScripts = { build: 'webpack' };
    mockSelect.mockRejectedValue(new Error('Selection error'));

    await expect(getUserScriptChoice(scripts)).rejects.toThrow(
      'Selection error'
    );
  });
});
