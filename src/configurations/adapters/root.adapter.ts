import { ResultAsync } from '../../helpers/result.helper';

/**
 * The RootAdapter class handles operations related to the root status of the application.
 */
export class RootAdapter {
  private rootStatus: Promise<{ message: string }>;

  /**
   * Initializes the RootAdapter and sets the root status.
   * The root status is represented as a promise that resolves to an object with a message.
   */
  constructor() {
    this.rootStatus = new Promise<{ message: string }>((resolve) => {
      resolve({ message: 'ok' });
    });
  }

  /**
   * Returns the root status message along with an additional test message.
   * Combines the resolved message from rootStatus with the provided test_message.
   *
   * @param test_message - The test message to be added to the root status.
   * @returns A ResultAsync object containing the combined status message and test message, or an error.
   */
  async returnStatusMessage(test_message: string) {
    return ResultAsync.fromPromise<{ message: string; test_message: string }, Error>(
      this.rootStatus.then((result) => ({
        ...result,
        test_message,
      })),
      (error) => new Error(`Failed to return root status: ${error instanceof Error ? error.message : String(error)}`)
    );
  }
}
