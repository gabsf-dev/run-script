vi.mock('fs');
vi.mock('@inquirer/prompts');

import { hasNodeModules, promptInstallNodeModules } from '../utils/nodeModules';
import * as fs from 'fs';
import * as inquirer from '@inquirer/prompts';
import { Mock } from 'vitest';

const mockFsExistsSync = fs.existsSync as Mock;
const mockConfirm = inquirer.confirm as Mock;

describe('nodeModules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasNodeModules', () => {
    it('should return true when node_modules exists', () => {
      mockFsExistsSync.mockReturnValue(true);

      const result = hasNodeModules();

      expect(result).toBe(true);
      expect(mockFsExistsSync).toHaveBeenCalledWith('node_modules');
    });

    it('should return false when node_modules does not exist', () => {
      mockFsExistsSync.mockReturnValue(false);

      const result = hasNodeModules();

      expect(result).toBe(false);
      expect(mockFsExistsSync).toHaveBeenCalledWith('node_modules');
    });
  });

  describe('promptInstallNodeModules', () => {
    it('should return true when user confirms', async () => {
      mockConfirm.mockResolvedValue(true);

      const result = await promptInstallNodeModules();

      expect(result).toBe(true);
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('No node_modules found'),
          default: true,
        })
      );
    });

    it('should return false when user declines', async () => {
      mockConfirm.mockResolvedValue(false);

      const result = await promptInstallNodeModules();

      expect(result).toBe(false);
      expect(mockConfirm).toHaveBeenCalled();
    });

    it('should return false when prompt throws error', async () => {
      mockConfirm.mockRejectedValue(new Error('Prompt error'));

      const result = await promptInstallNodeModules();

      expect(result).toBe(false);
    });
  });
});
