import { Result } from "../helpers/result.helper";
import { IRouter, IUseCallback } from "./";

/**
 * Interface for a server that can use plugins, routers, and listen on a port.
 */
export interface IServer {
  /**
   * Registers a plugin or middleware with an optional prefix.
   * @param prefix The URL prefix for the middleware.
   * @param opts The plugin or middleware callback.
   * @returns A promise that resolves to a Result indicating success or failure.
   */
  use(prefix: string, opts: IUseCallback): Promise<Result<void, string>>;

  /**
   * Adds a collection of routers to the server.
   * @param routers An array of IRouter instances.
   * @returns A promise that resolves to a Result indicating success or failure.
   */
  useRouters(routers: IRouter[]): Promise<Result<void, string>>;

  /**
   * Starts the server to listen on the specified port.
   * @param port The port number to listen on.
   * @returns A promise that resolves to a Result indicating success or failure.
   */
  listen(port: number): Promise<Result<void, string>>;
}
