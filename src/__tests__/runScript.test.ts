import { runScript } from '../utils/runScript';
import { execSync } from 'child_process';
import * as getRunCommandModule from '../utils/getRunCommand';
import * as getUserScriptChoiceModule from '../utils/getUserScriptChoice';
import * as logScriptsModule from '../utils/logScripts';
import * as nodeModulesModule from '../utils/nodeModules';
import * as packageJsonModule from '../utils/packageJson';
import * as handleErrorsModule from '../utils/handleErrors';
import { CONSOLE_GREEN, CONSOLE_RESET } from '../utils/constants';
import { Mock } from 'vitest';

vi.mock('child_process');
vi.mock('../utils/getRunCommand');
vi.mock('../utils/getUserScriptChoice');
vi.mock('../utils/logScripts');
vi.mock('../utils/nodeModules');
vi.mock('../utils/packageJson');
vi.mock('../utils/handleErrors');

const mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});

describe('runScript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (packageJsonModule.checkPackageJsonExists as Mock).mockReturnValue(true);
    (packageJsonModule.getPackageJsonScripts as Mock).mockReturnValue({
      build: 'webpack',
      test: 'vi',
    });
  });

  it('should log scripts table when onlyView is true', async () => {
    await runScript({ onlyView: true });

    expect(logScriptsModule.logScriptsOptionsTable).toHaveBeenCalledWith({
      build: 'webpack',
      test: 'vi',
    });
  });

  it('should get user script choice when onlyView is false', async () => {
    (nodeModulesModule.hasNodeModules as Mock).mockReturnValue(true);
    (getUserScriptChoiceModule.getUserScriptChoice as Mock).mockResolvedValue(
      'build'
    );
    (getRunCommandModule.getRunCommand as Mock).mockResolvedValue({
      command: 'npm',
      args: ['run', 'build'],
    });

    await runScript({ onlyView: false });

    expect(getUserScriptChoiceModule.getUserScriptChoice).toHaveBeenCalledWith({
      build: 'webpack',
      test: 'vi',
    });
  });

  it('should run the script with npm when node_modules exists', async () => {
    (nodeModulesModule.hasNodeModules as Mock).mockReturnValue(true);
    (getUserScriptChoiceModule.getUserScriptChoice as Mock).mockResolvedValue(
      'build'
    );
    (getRunCommandModule.getRunCommand as Mock).mockResolvedValue({
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
    (nodeModulesModule.hasNodeModules as Mock).mockReturnValue(false);
    (nodeModulesModule.promptInstallNodeModules as Mock).mockResolvedValue(
      true
    );
    (getUserScriptChoiceModule.getUserScriptChoice as Mock).mockResolvedValue(
      'build'
    );
    (getRunCommandModule.getRunCommand as Mock).mockResolvedValue({
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
    (nodeModulesModule.hasNodeModules as Mock).mockReturnValue(false);
    (nodeModulesModule.promptInstallNodeModules as Mock).mockResolvedValue(
      false
    );
    (getUserScriptChoiceModule.getUserScriptChoice as Mock).mockResolvedValue(
      'build'
    );
    (getRunCommandModule.getRunCommand as Mock).mockResolvedValue({
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
    (packageJsonModule.checkPackageJsonExists as Mock).mockReturnValue(false);

    await runScript({ onlyView: false });

    expect(handleErrorsModule.handleErrors).toHaveBeenCalled();
  });

  it('should run yarn script when yarn is detected', async () => {
    (nodeModulesModule.hasNodeModules as Mock).mockReturnValue(true);
    (getUserScriptChoiceModule.getUserScriptChoice as Mock).mockResolvedValue(
      'test'
    );
    (getRunCommandModule.getRunCommand as Mock).mockResolvedValue({
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
