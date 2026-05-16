import { existsSync } from 'fs';
import {
  checkPackageJsonExists,
  getPackageJsonScripts,
} from '../utils/packageJson';
import { Mock } from 'vitest';

vi.mock('fs');

describe('packageJson', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe('checkPackageJsonExists', () => {
    it('should return true when package.json exists', () => {
      (existsSync as Mock).mockReturnValue(true);

      const result = checkPackageJsonExists('/path/to/project');

      expect(result).toBe(true);
    });

    it('should return false when package.json does not exist', () => {
      (existsSync as Mock).mockReturnValue(false);

      const result = checkPackageJsonExists('/path/to/project');

      expect(result).toBe(false);
    });
  });

  describe('getPackageJsonScripts', () => {
    it('should return scripts object from package.json', () => {
      const scripts = getPackageJsonScripts(process.cwd());

      expect(typeof scripts).toBe('object');
      expect(scripts).not.toBeNull();
    });

    it('should return scripts with correct structure', () => {
      const scripts = getPackageJsonScripts(process.cwd());

      if (Object.keys(scripts).length > 0) {
        Object.entries(scripts).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('string');
        });
      }
    });

    it('should contain common scripts like test', () => {
      const scripts = getPackageJsonScripts(process.cwd());

      expect(scripts).toHaveProperty('test');
    });
  });
});
