import { HttpStatus } from "../helpers/http-status.helper";
import { IRouter } from "../interfaces";
import { Router } from "./Router";

/**
 * Creates and returns a root router with a predefined status route.
 * The status route can be used for service health checks, responding
 * with an HTTP 200 OK status and a JSON body indicating the service status.
 *
 * @returns {IRouter} The root router configured with the status route.
 */
export const rootRoute = (): IRouter => {
  const root_router = new Router();

  // Define a route for service health checks.
  root_router.addRoute({
    path: "/status", // The path for the health check route.
    method: "GET", // HTTP method to respond to.
    handler: async (_request, reply) => {
      // Handler function to send back the service status.
      reply.status(HttpStatus.OK).send({
        status: "up", // Indicate the service is up and running.
      });
    },
  });

  return root_router; // Return the configured router.
};
