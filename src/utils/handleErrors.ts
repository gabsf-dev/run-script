import { ERROR_MESSAGES } from './constants';

export const handleErrors = (error: any) => {
  if (
    error.code === 'MODULE_NOT_FOUND' ||
    error.message === ERROR_MESSAGES.NO_PACKAGE_JSON
  ) {
    console.error('\n::: No package.json found in the folder');
    return;
  }

  if (error.message === ERROR_MESSAGES.CANNOT_DETECT_PACKAGE_MANAGER) {
    console.error(
      '\n::: Could not detect a package manager. Please make sure you have npm or yarn installed, or choose to use npm when prompted.'
    );
    return;
  }

  if (
    error.message === "Prompt couldn't be rendered in the current environment"
  ) {
    console.error(
      "\n::: Prompt couldn't be rendered in the current environment"
    );
    return;
  }

  if (error.name === 'ExitPromptError') {
    console.error('\n::: Exiting run-script');
    return;
  }

  console.error('\n::: Unknown error occurred');
  console.error(error.message);
};
