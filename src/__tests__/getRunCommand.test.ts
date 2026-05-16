import { getRunCommand } from '../utils/getRunCommand';
import { ERROR_MESSAGES } from '../utils/constants';

jest.mock('package-manager-detector');
jest.mock('@inquirer/prompts');

describe('getRunCommand', () => {
  let mockDetect: jest.Mock;
  let mockResolveCommand: jest.Mock;
  let mockConfirm: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const detector = require('package-manager-detector');
    const inquirer = require('@inquirer/prompts');
    mockDetect = detector.detect;
    mockResolveCommand = detector.resolveCommand;
    mockConfirm = inquirer.confirm;
  });

  it('should return npm run command when npm is detected', async () => {
    mockDetect.mockResolvedValue({
      agent: 'npm',
      version: '8.0.0',
    });
    mockResolveCommand.mockReturnValue({
      command: 'npm',
      args: ['run', 'dev'],
    });

    const result = await getRunCommand('dev');

    expect(result).toEqual({ command: 'npm', args: ['run', 'dev'] });
    expect(mockDetect).toHaveBeenCalled();
    expect(mockResolveCommand).toHaveBeenCalledWith('npm', 'run', ['dev']);
  });

  it('should return yarn run command when yarn is detected', async () => {
    mockDetect.mockResolvedValue({
      agent: 'yarn',
      version: '3.0.0',
    });
    mockResolveCommand.mockReturnValue({
      command: 'yarn',
      args: ['run', 'test'],
    });

    const result = await getRunCommand('test');

    expect(result).toEqual({ command: 'yarn', args: ['run', 'test'] });
  });

  it('should prompt user to use npm when package manager is not detected', async () => {
    mockDetect.mockResolvedValue(null);
    mockConfirm.mockResolvedValue(true);

    const result = await getRunCommand('build');

    expect(result).toEqual({ command: 'npm', args: ['run', 'build'] });
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Could not detect a package manager'),
        default: true,
      })
    );
  });

  it('should throw CANNOT_DETECT_PACKAGE_MANAGER error when user chooses not to use npm', async () => {
    mockDetect.mockResolvedValue(null);
    mockConfirm.mockResolvedValue(false);

    await expect(getRunCommand('build')).rejects.toThrow(
      ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER
    );
  });

  it('should throw error when resolveCommand returns null', async () => {
    mockDetect.mockResolvedValue({
      agent: 'unknown',
      version: '1.0.0',
    });
    mockResolveCommand.mockReturnValue(null);

    await expect(getRunCommand('build')).rejects.toThrow();
  });

  it('should handle confirm prompt throwing an error', async () => {
    mockDetect.mockResolvedValue(null);
    mockConfirm.mockRejectedValue(new Error('Prompt error'));

    await expect(getRunCommand('build')).rejects.toThrow(
      ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER
    );
  });
});
