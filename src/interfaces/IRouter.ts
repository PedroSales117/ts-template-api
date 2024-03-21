/**
 * Defines the structure of an HTTP request with strongly typed body, query parameters, and route parameters.
 *
 * @template Body Type of the request body, defaults to `unknown` for flexibility.
 * @template Query Type of the query parameters, defaults to `unknown`.
 * @template Params Type of the route parameters, defaults to `unknown`.
 */
interface IRequest<Body = unknown, Query = unknown, Params = unknown> {
  body: Body; // The payload of the request.
  query: Query; // The query parameters of the request.
  params: Params; // The route parameters of the request.
}

/**
 * Defines the interface for crafting HTTP replies within route handlers.
 * Allows setting the HTTP status code and sending a response.
 */
interface IReply {
  send: <Response>(body: Response) => void; // Sends a response with the specified body.
  status: (statusCode: number) => IReply; // Sets the status code of the response and returns the IReply instance for chaining.
}

/**
 * Describes an HTTP route within the application, including the path, HTTP method, and the handler function.
 *
 * @template Request Extends the `IRequest` interface, allowing for request typing.
 * @template Response The expected type of the response body.
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
 * Provides an abstraction for a router, capable of adding and retrieving routes.
 */
export interface IRouter {
  addRoute(route: IRoute): void; // Adds a new route to the router.
  getRoutes(): IRoute[]; // Retrieves all routes added to the router.
}
