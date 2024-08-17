import "reflect-metadata";
import "dotenv/config";
import { rootRoute } from "./routes/root.route";
import { HttpServer } from "./configurations/server";
import logger from "./utils/logger";

/**
 * Initializes and configures the HTTP server.
 * Adds necessary routes to the server and starts listening on a specified PORT.
 * The PORT is defined by the PORT environment variable or uses 3000 as a default.
 */
const app = async (): Promise<void> => {
  try {
    // Creates a new instance of the HTTP server.
    const server = new HttpServer();

    // Adds routes to the server. useRouters is now asynchronous.
    await server.useRouters([rootRoute()]);

    // Sets the PORT with a default value of 3000 if the PORT environment variable is not defined.
    const PORT = process.env.PORT;

    // Attempts to start the server on the specified PORT and handles errors, if any.
    const listenResult = await server.listen(PORT);
    if (listenResult.isErr()) {
      logger.error(`Error starting server: ${listenResult.error}`);
      process.exit(1); // Exiting the process if the server fails to start
    }
  } catch (error) {
    logger.error(`Unexpected error during server initialization: ${error}`);
    process.exit(1); // Exiting the process if an unexpected error occurs
  }
};

// Executes the application's main function.
void app();
