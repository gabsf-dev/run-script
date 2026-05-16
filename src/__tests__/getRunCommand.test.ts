import { getRunCommand } from '../utils/getRunCommand';
import { ERROR_MESSAGES } from '../utils/constants';
import { Mock } from 'vitest';
import { detect, resolveCommand } from 'package-manager-detector';
import { confirm } from '@inquirer/prompts';

vi.mock('package-manager-detector');
vi.mock('@inquirer/prompts');

describe('getRunCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return npm run command when npm is detected', async () => {
    (detect as Mock).mockResolvedValue({
      agent: 'npm',
      version: '8.0.0',
    });
    (resolveCommand as Mock).mockReturnValue({
      command: 'npm',
      args: ['run', 'dev'],
    });

    const result = await getRunCommand('dev');

    expect(result).toEqual({ command: 'npm', args: ['run', 'dev'] });
    expect(detect).toHaveBeenCalled();
    expect(resolveCommand).toHaveBeenCalledWith('npm', 'run', ['dev']);
  });

  it('should return yarn run command when yarn is detected', async () => {
    (detect as Mock).mockResolvedValue({
      agent: 'yarn',
      version: '3.0.0',
    });
    (resolveCommand as Mock).mockReturnValue({
      command: 'yarn',
      args: ['run', 'test'],
    });

    const result = await getRunCommand('test');

    expect(result).toEqual({ command: 'yarn', args: ['run', 'test'] });
  });

  it('should prompt user to use npm when package manager is not detected', async () => {
    (detect as Mock).mockResolvedValue(null);
    (confirm as Mock).mockResolvedValue(true);

    const result = await getRunCommand('build');

    expect(result).toEqual({ command: 'npm', args: ['run', 'build'] });
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Could not detect a package manager'),
        default: true,
      })
    );
  });

  it('should throw CANNOT_DETECT_PACKAGE_MANAGER error when user chooses not to use npm', async () => {
    (detect as Mock).mockResolvedValue(null);
    (confirm as Mock).mockResolvedValue(false);

    await expect(getRunCommand('build')).rejects.toThrow(
      ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER
    );
  });

  it('should throw error when resolveCommand returns null', async () => {
    (detect as Mock).mockResolvedValue({
      agent: 'unknown',
      version: '1.0.0',
    });
    (resolveCommand as Mock).mockReturnValue(null);

    await expect(getRunCommand('build')).rejects.toThrow();
  });

  it('should handle confirm prompt throwing an error', async () => {
    (detect as Mock).mockResolvedValue(null);
    (confirm as Mock).mockRejectedValue(new Error('Prompt error'));

    await expect(getRunCommand('build')).rejects.toThrow(
      ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER
    );
  });
});
