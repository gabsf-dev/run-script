import {
  checkPackageJsonExists,
  getPackageJsonVersion,
  getPackageJsonScripts,
} from '../utils/packageJson';
import { TScripts } from '../types';

const mockFsExistsSync = jest.fn();

jest.mock('fs', () => ({
  existsSync: mockFsExistsSync,
}));

describe('packageJson', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockFsExistsSync.mockClear();
  });

  describe('checkPackageJsonExists', () => {
    it('should return true when package.json exists', () => {
      mockFsExistsSync.mockReturnValue(true);

      const result = checkPackageJsonExists('/path/to/project');

      expect(result).toBe(true);
    });

    it('should return false when package.json does not exist', () => {
      mockFsExistsSync.mockReturnValue(false);

      const result = checkPackageJsonExists('/path/to/project');

      expect(result).toBe(false);
    });
  });

  describe('getPackageJsonVersion', () => {
    it('should return the version from package.json', () => {
      const version = getPackageJsonVersion();

      expect(typeof version).toBe('string');
      expect(version).toBeTruthy();
    });

    it('should return a non-empty string', () => {
      const version = getPackageJsonVersion();

      expect(version.length).toBeGreaterThan(0);
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
