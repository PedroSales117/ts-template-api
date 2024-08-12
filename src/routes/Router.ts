import { IRoute, IRouter } from "../interfaces/IRouter";
import logger from "../utils/logger";

/**
 * Implements the IRouter interface, managing routes for the HTTP server.
 */
export class Router implements IRouter {
  private routes: IRoute[] = []; // Stores the routes added to the router.

  /**
   * Adds a new route to the router.
   * Checks if the route already exists to prevent duplicates before adding.
   * @param route {IRoute} The route to be added.
   */
  addRoute(route: IRoute): void {
    const routeExists = this.routes.some(
      (existingRoute) =>
        existingRoute.path === route.path &&
        existingRoute.method === route.method,
    );

    if (!routeExists) {
      this.routes.push(route);
    } else {
      logger.warn(
        `Warning: Route ${route.method} ${route.path} already exists. Duplicate routes are not added.`,
      );
    }
  }

  /**
   * Returns all the routes added to the router.
   * @return {IRoute[]} A list of routes.
   */
  getRoutes(): IRoute[] {
    return this.routes;
  }

  /**
   * Finds a specific route by path and method.
   * Useful for debugging or additional functionalities.
   * @param path {string} The path of the route to be found.
   * @param method {string} The HTTP method of the route to be found.
   * @return {IRoute | undefined} The found route or undefined if not found.
   */
  findRoute(path: string, method: string): IRoute | undefined {
    return this.routes.find(
      (route) => route.path === path && route.method === method,
    );
  }
}
