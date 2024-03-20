import { IRoute, IRouter } from "../interfaces/IRouter";

export class Router implements IRouter {
  private routes: IRoute[] = [];

  addRoute(route: IRoute): void {
    this.routes.push(route);
  }

  getRoutes(): IRoute[] {
    return this.routes;
  }
}
