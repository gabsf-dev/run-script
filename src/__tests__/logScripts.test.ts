import { logScriptsOptionsTable } from '../utils/logScripts';
import { Table } from 'console-table-printer';
import { TScripts } from '../types';

jest.mock('console-table-printer');

describe('logScriptsOptionsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create table with columns and add rows for each script', () => {
    const scripts: TScripts = { build: 'webpack', test: 'jest' };
    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();

    (Table as jest.Mock).mockImplementation(() => ({
      addRow: mockAddRow,
      printTable: mockPrintTable,
    }));

    logScriptsOptionsTable(scripts);

    expect(Table).toHaveBeenCalledWith({
      columns: [
        { name: 'script', alignment: 'left', color: 'blue' },
        { name: 'command', alignment: 'left', color: 'green' },
      ],
    });

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

  it('should handle single script', () => {
    const scripts: TScripts = { start: 'node index.js' };
    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();

    (Table as jest.Mock).mockImplementation(() => ({
      addRow: mockAddRow,
      printTable: mockPrintTable,
    }));

    logScriptsOptionsTable(scripts);

    expect(mockAddRow).toHaveBeenCalledTimes(1);
    expect(mockAddRow).toHaveBeenCalledWith({
      script: 'start',
      command: 'node index.js',
    });
    expect(mockPrintTable).toHaveBeenCalled();
  });

  it('should handle multiple scripts', () => {
    const scripts: TScripts = {
      build: 'webpack',
      test: 'jest',
      lint: 'eslint .',
      dev: 'webpack-dev-server',
    };
    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();

    (Table as jest.Mock).mockImplementation(() => ({
      addRow: mockAddRow,
      printTable: mockPrintTable,
    }));

    logScriptsOptionsTable(scripts);

    expect(mockAddRow).toHaveBeenCalledTimes(4);
    expect(mockPrintTable).toHaveBeenCalled();
  });
});
