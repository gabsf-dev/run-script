import { handleErrors } from '../utils/handleErrors';
import { ERROR_MESSAGES } from '../utils/constants';

const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('handleErrors', () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
  });

  it('should handle MODULE_NOT_FOUND error', () => {
    const error = new Error('Module not found');
    (error as any).code = 'MODULE_NOT_FOUND';

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      '\n::: No package.json found in the folder'
    );
  });

  it('should handle NO_PACKAGE_JSON error message', () => {
    const error = new Error(ERROR_MESSAGES.NO_PACKAGE_JSON);

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      '\n::: No package.json found in the folder'
    );
  });

  it('should handle CANNOT_DETECT_PACKAGE_MANAGER error', () => {
    const error = new Error(ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER);

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Could not detect a package manager')
    );
  });

  it('should handle prompt render error', () => {
    const error = new Error(
      "Prompt couldn't be rendered in the current environment"
    );

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      "\n::: Prompt couldn't be rendered in the current environment"
    );
  });

  it('should handle ExitPromptError', () => {
    const error = new Error('Exit requested');
    (error as any).name = 'ExitPromptError';

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      '\n::: Process interrupted. Exiting...'
    );
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error message');

    handleErrors(error);

    expect(mockConsoleError).toHaveBeenCalledWith(
      '\n::: Unknown error occurred'
    );
    expect(mockConsoleError).toHaveBeenCalledWith('Unknown error message');
  });
});
