import {
  getPackageJsonVersion,
  getTrueObjectKey,
  logScriptsOptionsTable,
  getUserScriptChoice,
  CONSOLE_GREEN,
  CONSOLE_RESET,
} from '../utils';
import { Table } from 'console-table-printer';
import inquirer from 'inquirer';

jest.mock('console-table-printer');
jest.mock('inquirer');

describe('utils', () => {
  describe('getPackageJsonVersion', () => {
    it('should return the version from package.json', () => {
      jest.mock('../../package.json', () => ({ version: '1.0.0' }), {
        virtual: true,
      });
      const version = getPackageJsonVersion();
      expect(version).toBe('1.0.0');
    });
  });

  describe('getTrueObjectKey', () => {
    it('should return the key of the first true value', () => {
      const obj = { a: false, b: true, c: false };
      const key = getTrueObjectKey(obj);
      expect(key).toBe('b');
    });

    it('should return undefined if no true value is found', () => {
      const obj = { a: false, b: false, c: false };
      const key = getTrueObjectKey(obj);
      expect(key).toBeUndefined();
    });
  });

  describe('logScriptsOptionsTable', () => {
    it('should log the scripts table', () => {
      const scripts = { build: 'webpack', test: 'jest' };
      const mockAddRow = jest.fn();
      const mockPrintTable = jest.fn();

      (Table as jest.Mock).mockImplementation(() => ({
        addRow: mockAddRow,
        printTable: mockPrintTable,
      }));

      logScriptsOptionsTable(scripts);

      expect(mockAddRow).toHaveBeenCalledWith({
        script: 'build',
        command: 'webpack',
      });
      expect(mockAddRow).toHaveBeenCalledWith({
        script: 'test',
        command: 'jest',
      });
      expect(mockPrintTable).toHaveBeenCalled();
    });
  });

  describe('getUserScriptChoice', () => {
    it('should return the selected script', async () => {
      const scripts = { build: 'webpack', test: 'jest' };
      const mockPrompt = jest.fn().mockResolvedValue({ script: 'build' });

      (inquirer.prompt as any) = mockPrompt;

      const script = await getUserScriptChoice(scripts);

      expect(script).toBe('build');
      expect(mockPrompt).toHaveBeenCalledWith([
        {
          type: 'list',
          name: 'script',
          message: 'Select the script to run',
          choices: [
            { name: 'build  [webpack]', value: 'build' },
            { name: 'test  [jest]', value: 'test' },
          ],
        },
      ]);
    });

    it('should handle prompt errors', async () => {
      const scripts = { build: 'webpack', test: 'jest' };
      const mockPrompt = jest.fn().mockRejectedValue(new Error('Prompt error'));

      (inquirer.prompt as any) = mockPrompt;

      await expect(getUserScriptChoice(scripts)).rejects.toThrow(
        'Prompt error'
      );
    });
  });

  describe('CONSOLE_GREEN and CONSOLE_RESET', () => {
    it('should have the correct values', () => {
      expect(CONSOLE_GREEN).toBe('\u001b[32m');
      expect(CONSOLE_RESET).toBe('\u001b[0m');
    });
  });
});
