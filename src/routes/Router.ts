import { IRoute, IRouter } from "../interfaces/IRouter";

export class Router implements IRouter {
  private routes: IRoute[] = [];

  addRoute(route: IRoute): void {
    const routeExists = this.routes.some(
      (existingRoute) =>
        existingRoute.path === route.path &&
        existingRoute.method === route.method,
    );

    if (routeExists) {
      console.warn(
        `Warning: Route ${route.method} ${route.path} already exists. Duplicate routes are not added.`,
      );
    } else {
      this.routes.push(route);
    }
  }

  getRoutes(): IRoute[] {
    return this.routes;
  }

  findRoute(path: string, method: string): IRoute | undefined {
    return this.routes.find(
      (route) => route.path === path && route.method === method,
    );
  }
}
