import "dotenv/config";
import { rootRoute } from "./routes";
import { HttpServer } from "./configurations/server";

/**
 * Initializes and configures the HTTP server.
 * Adds necessary routes to the server and starts listening on a specified port.
 * The port is defined by the PORT environment variable or uses 3000 as a default.
 */
const app = async (): Promise<void> => {
  // Creates a new instance of the HTTP server.
  const server = new HttpServer();

  // Adds routes to the server. useRouters is now asynchronous.
  await server.useRouters([rootRoute()]);

  // Sets the port with a default value of 3000 if the PORT environment variable is not defined.
  const port = Number(process.env.PORT) || 3000;

  // Attempts to start the server on the specified port and handles errors, if any.
  const listenResult = await server.listen(port);
  if (listenResult.isErr()) {
    console.error(`Error starting server: ${listenResult.error}`);
  }
};

// Executes the application's main function.
void app();
