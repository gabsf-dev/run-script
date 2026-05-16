import { runScript } from '../utils/runScript';
import { execSync } from 'child_process';
import * as getRunCommandModule from '../utils/getRunCommand';
import * as getUserScriptChoiceModule from '../utils/getUserScriptChoice';
import * as logScriptsModule from '../utils/logScripts';
import * as nodeModulesModule from '../utils/nodeModules';
import * as packageJsonModule from '../utils/packageJson';
import * as handleErrorsModule from '../utils/handleErrors';
import { CONSOLE_GREEN, CONSOLE_RESET } from '../utils/constants';

jest.mock('child_process');
jest.mock('../utils/getRunCommand');
jest.mock('../utils/getUserScriptChoice');
jest.mock('../utils/logScripts');
jest.mock('../utils/nodeModules');
jest.mock('../utils/packageJson');
jest.mock('../utils/handleErrors');

const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();

describe('runScript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (packageJsonModule.checkPackageJsonExists as jest.Mock).mockReturnValue(
      true
    );
    (packageJsonModule.getPackageJsonScripts as jest.Mock).mockReturnValue({
      build: 'webpack',
      test: 'jest',
    });
  });

  it('should log scripts table when onlyView is true', async () => {
    await runScript({ onlyView: true });

    expect(logScriptsModule.logScriptsOptionsTable).toHaveBeenCalledWith({
      build: 'webpack',
      test: 'jest',
    });
  });

  it('should get user script choice when onlyView is false', async () => {
    (nodeModulesModule.hasNodeModules as jest.Mock).mockReturnValue(true);
    (
      getUserScriptChoiceModule.getUserScriptChoice as jest.Mock
    ).mockResolvedValue('build');
    (getRunCommandModule.getRunCommand as jest.Mock).mockResolvedValue({
      command: 'npm',
      args: ['run', 'build'],
    });

    await runScript({ onlyView: false });

    expect(getUserScriptChoiceModule.getUserScriptChoice).toHaveBeenCalledWith({
      build: 'webpack',
      test: 'jest',
    });
  });

  it('should run the script with npm when node_modules exists', async () => {
    (nodeModulesModule.hasNodeModules as jest.Mock).mockReturnValue(true);
    (
      getUserScriptChoiceModule.getUserScriptChoice as jest.Mock
    ).mockResolvedValue('build');
    (getRunCommandModule.getRunCommand as jest.Mock).mockResolvedValue({
      command: 'npm',
      args: ['run', 'build'],
    });

    await runScript({ onlyView: false });

    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        'npm run build' +
        CONSOLE_RESET +
        '\n'
    );
    expect(execSync).toHaveBeenCalledWith('npm run build', {
      stdio: 'inherit',
    });
  });

  it('should prompt to install node_modules when not present and user confirms', async () => {
    (nodeModulesModule.hasNodeModules as jest.Mock).mockReturnValue(false);
    (nodeModulesModule.promptInstallNodeModules as jest.Mock).mockResolvedValue(
      true
    );
    (
      getUserScriptChoiceModule.getUserScriptChoice as jest.Mock
    ).mockResolvedValue('build');
    (getRunCommandModule.getRunCommand as jest.Mock).mockResolvedValue({
      command: 'npm',
      args: ['run', 'build'],
    });

    await runScript({ onlyView: false });

    expect(nodeModulesModule.promptInstallNodeModules).toHaveBeenCalled();
    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '\n::: Installing node modules...'
    );
    expect(execSync).toHaveBeenCalledWith('npm install', { stdio: 'inherit' });
  });

  it('should not install node_modules when user declines', async () => {
    (nodeModulesModule.hasNodeModules as jest.Mock).mockReturnValue(false);
    (nodeModulesModule.promptInstallNodeModules as jest.Mock).mockResolvedValue(
      false
    );
    (
      getUserScriptChoiceModule.getUserScriptChoice as jest.Mock
    ).mockResolvedValue('build');
    (getRunCommandModule.getRunCommand as jest.Mock).mockResolvedValue({
      command: 'npm',
      args: ['run', 'build'],
    });

    await runScript({ onlyView: false });

    expect(execSync).toHaveBeenCalledWith('npm run build', {
      stdio: 'inherit',
    });
    expect(execSync).not.toHaveBeenCalledWith('npm install', {
      stdio: 'inherit',
    });
  });

  it('should handle errors gracefully', async () => {
    (packageJsonModule.checkPackageJsonExists as jest.Mock).mockReturnValue(
      false
    );

    await runScript({ onlyView: false });

    expect(handleErrorsModule.handleErrors).toHaveBeenCalled();
  });

  it('should run yarn script when yarn is detected', async () => {
    (nodeModulesModule.hasNodeModules as jest.Mock).mockReturnValue(true);
    (
      getUserScriptChoiceModule.getUserScriptChoice as jest.Mock
    ).mockResolvedValue('test');
    (getRunCommandModule.getRunCommand as jest.Mock).mockResolvedValue({
      command: 'yarn',
      args: ['run', 'test'],
    });

    await runScript({ onlyView: false });

    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '\n::: Running script with: ' +
        CONSOLE_GREEN +
        'yarn run test' +
        CONSOLE_RESET +
        '\n'
    );
    expect(execSync).toHaveBeenCalledWith('yarn run test', {
      stdio: 'inherit',
    });
  });
});
