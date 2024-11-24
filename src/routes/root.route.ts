import { IRouter } from "../interfaces";
import { Router } from "./Router";
import { RootController } from "../controllers/root.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
import { AdapterReply, AdapterRequest } from "../configurations/adapters/server.adapter";

/**
 * Creates and returns a root router with a predefined route for checking service status.
 * This route is typically used for health checks, returning the current status of the service.
 *
 * @returns {IRouter} The root router configured with the status route.
 */
export const rootRoute = (): IRouter => {
  const root_router = new Router();
  const authMiddleware = new AuthMiddleware();

  /**
   * Middleware to validate authentication for protected routes.
   */
  const authGuard = async (request: AdapterRequest, reply: AdapterReply) => {
    await authMiddleware.authenticate(request, reply);
  };

  // Define a route for service health checks.
  root_router.addRoute({
    path: "/status", // The path for the status check route.
    method: "POST", // HTTP method to respond with.
    middlewares: [authGuard],
    handler: async (request, reply) => {
      // Handler function to return the service status message.
      await new RootController().returnStatusMessage(request, reply);
    },
  });

  return root_router; // Return the configured router with the status route.
};
