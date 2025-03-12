import { runScript } from '../runScript';
import { execSync } from 'child_process';
import fs from 'fs';

import {
  CONSOLE_GREEN,
  CONSOLE_RESET,
  getTrueObjectKey,
  getUserScriptChoice,
  logScriptsOptionsTable,
} from '../utils';

jest.mock('child_process');
jest.mock('fs');
jest.mock('../utils');

const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

const mockCwd = jest.spyOn(process, 'cwd');
mockCwd.mockReturnValue('/mock/path');

describe('runScript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
  });

  it('should log a message if withAi is true', async () => {
    await runScript({ withAi: true, onlyView: false });
    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '::: Running scripts with AI is not supported yet'
    );
  });

  it('should log the scripts table if onlyView is true', async () => {
    const mockScripts = { build: 'webpack', test: 'jest' };
    jest.mock('/mock/path/package.json', () => ({ scripts: mockScripts }), {
      virtual: true,
    });

    await runScript({ withAi: false, onlyView: true });
    expect(logScriptsOptionsTable).toHaveBeenCalledWith(mockScripts);
  });

  it('should throw an error if no lock file is found', async () => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (path) => !path.includes('lock')
    );

    await runScript({ withAi: false, onlyView: false });
    expect(mockConsoleError).toHaveBeenCalledWith(
      '::: No lock file found. Please run `npm install` or `yarn install` before running scripts'
    );
  });

  it('should run the selected script with npm', async () => {
    const mockScripts = { build: 'webpack', test: 'jest' };
    jest.mock('/mock/path/package.json', () => ({ scripts: mockScripts }), {
      virtual: true,
    });
    (fs.existsSync as jest.Mock).mockImplementation(
      (path) => !path.includes('yarn')
    );
    (getTrueObjectKey as jest.Mock).mockReturnValue('npm');
    (getUserScriptChoice as jest.Mock).mockResolvedValue('build');

    await runScript({ withAi: false, onlyView: false });

    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        'npm run build' +
        CONSOLE_RESET
    );
    expect(execSync).toHaveBeenCalledWith('npm run build', {
      stdio: 'inherit',
    });
  });

  it('should run the selected script with yarn', async () => {
    const mockScripts = { build: 'webpack', test: 'jest' };
    jest.mock('/mock/path/package.json', () => ({ scripts: mockScripts }), {
      virtual: true,
    });
    (fs.existsSync as jest.Mock).mockImplementation(
      (path) => !path.includes('package-lock.json')
    );
    (getTrueObjectKey as jest.Mock).mockReturnValue('yarn');
    (getUserScriptChoice as jest.Mock).mockResolvedValue('test');

    await runScript({ withAi: false, onlyView: false });

    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        'yarn test' +
        CONSOLE_RESET
    );
    expect(execSync).toHaveBeenCalledWith('yarn test', { stdio: 'inherit' });
  });

  it('should handle MODULE_NOT_FOUND error', async () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => false);

    await runScript({ withAi: false, onlyView: false });

    expect(mockConsoleError).toHaveBeenCalledWith(
      '::: No package.json found in the folder'
    );
  });

  it('should handle prompt rendering error', async () => {
    const mockScripts = { build: 'webpack', test: 'jest' };
    jest.mock('/mock/path/package.json', () => ({ scripts: mockScripts }), {
      virtual: true,
    });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (getTrueObjectKey as jest.Mock).mockReturnValue('npm');
    (getUserScriptChoice as jest.Mock).mockRejectedValue(
      new Error("Prompt couldn't be rendered in the current environment")
    );

    await runScript({ withAi: false, onlyView: false });

    expect(mockConsoleError).toHaveBeenCalledWith(
      "::: Prompt couldn't be rendered in the current environment"
    );
  });

  it('should handle unknown errors', async () => {
    const mockScripts = { build: 'webpack', test: 'jest' };
    jest.mock('/mock/path/package.json', () => ({ scripts: mockScripts }), {
      virtual: true,
    });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (getTrueObjectKey as jest.Mock).mockReturnValue('npm');
    (getUserScriptChoice as jest.Mock).mockRejectedValue(
      new Error('Unknown error')
    );

    await runScript({ withAi: false, onlyView: false });

    expect(mockConsoleError).toHaveBeenCalledWith('::: Unknown error occurred');
    expect(mockConsoleError).toHaveBeenCalledWith('Unknown error');
  });
});
