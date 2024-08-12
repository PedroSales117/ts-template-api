import { AdapterReply, AdapterRequest } from "../configurations/adapters/server.adapter";

/**
 * Extends the base server.adapter `AdapterRequest` to represent a typed HTTP request within the application.
 * This interface is used to standardize the structure of requests handled by route handlers.
 */
export interface IRequest extends AdapterRequest {}

/**
 * Extends the base server.adapter `AdapterReply` to represent a typed HTTP reply within the application.
 * This interface is used to standardize the structure of replies sent by route handlers.
 */
export interface IReply extends AdapterReply {}

/**
 * Represents an HTTP route within the application, including the path, HTTP method, and handler function.
 * This interface is used to define the routes managed by routers in a type-safe manner.
 *
 * @template Request Extends the `IRequest` interface, providing type safety for the request object.
 * @template Response The expected type of the response body returned by the handler function.
 */
export interface IRoute<
  Request extends IRequest = IRequest,
  Response = unknown,
> {
  path: string; // The URL path of the route.
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // The HTTP method for the route.
  handler: (request: Request, reply: IReply) => Promise<Response>; // The function that handles the request.
}

/**
 * Defines the interface for a router, which is responsible for managing and retrieving HTTP routes.
 * This abstraction allows for easier management of multiple routes within the application.
 */
export interface IRouter {
  addRoute(route: IRoute): void; // Adds a new route to the router.
  getRoutes(): IRoute[]; // Retrieves all routes managed by the router.
}
