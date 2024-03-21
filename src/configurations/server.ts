import { ServerAdapter } from "./adapters/server.adapter";
import { IServer, IRouter, IUseCallback } from "../interfaces";
import { Result } from "../helpers/result.helper";

/**
 * HttpServer implements the IServer interface, delegating server operations
 * to a ServerAdapter instance. This class acts as a facade to the ServerAdapter,
 * enabling a separation of concerns and facilitating potential future adapters
 * for different server implementations.
 */
export class HttpServer implements IServer {
  private adapter: ServerAdapter;

  /**
   * Constructs a new HttpServer instance, initializing the underlying ServerAdapter.
   */
  constructor() {
    this.adapter = new ServerAdapter();
  }

  /**
   * Uses the ServerAdapter to register a middleware or plugin with an optional prefix.
   * @param prefix URL prefix for the middleware.
   * @param opts Middleware or plugin callback function or object.
   * @returns Promise<Result<void, string>> A promise resolved with the result of the middleware registration.
   */
  async use(prefix: string, opts: IUseCallback): Promise<Result<void, string>> {
    return this.adapter.use(prefix, opts);
  }

  /**
   * Utilizes the ServerAdapter to register an array of router objects.
   * @param routers Array of IRouter instances to be registered.
   * @returns Promise<Result<void, string>> A promise resolved with the result of the router registration.
   */
  async useRouters(routers: IRouter[]): Promise<Result<void, string>> {
    return this.adapter.useRouters(routers);
  }

  /**
   * Delegates the operation of starting the server on a specified port to the ServerAdapter.
   * @param port Port number on which the server will listen.
   * @returns Promise<Result<void, string>> A promise resolved with the result of the server start operation.
   */
  async listen(port: number): Promise<Result<void, string>> {
    return this.adapter.listen(port);
  }
}
