import Fastify, { FastifyInstance } from "fastify";
import { IRouter, IRoute, IUseCallback } from "../../interfaces";
import { Result, Ok, Err } from "../../helpers/result.helper";

/**
 * ServerAdapter provides an abstraction layer over the Fastify framework,
 * allowing for easy setup and management of routes and middlewares.
 */
export class ServerAdapter {
  private server: FastifyInstance;

  /**
   * Initializes the server with Fastify, enabling logging by default.
   */
  constructor() {
    this.server = Fastify({
      logger: true,
      bodyLimit: 30 * 1024 * 1024
    });

    this.server.addHook("onRequest", async (request, reply) => {
      reply.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN);
      reply.header("Access-Control-Allow-Credentials", true);
      reply.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID");
      reply.header("Access-Control-Allow-Methods", "OPTIONS, POST, PUT, PATCH, GET, DELETE");
      if (request.method === "OPTIONS") {
        reply.send();
      }
    });
  }

  /**
   * Registers a middleware or a series of middlewares to the server with an optional prefix.
   * @param prefix The URL prefix for all paths within the middleware.
   * @param opts Middleware function or an object describing the middleware.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async use(prefix: string, opts: IUseCallback): Promise<Result<void, string>> {
    try {
      await this.server.register(opts, { prefix });
      return Ok(undefined);
    } catch (error) {
      return Err(
        `Failed to use middleware: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  /**
   * Registers an array of routers to the server, each containing a set of routes.
   * @param routers An array of IRouter, each router managing multiple routes.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async useRouters(routers: IRouter[]): Promise<Result<void, string>> {
    try {
      await this.use("/api", (instance, _opts, done) => {
        for (const router of routers) {
          router.getRoutes().forEach((route: IRoute) => {
            instance.route({
              method: route.method,
              url: route.path,
              handler: route.handler,
            });
          });
        }
        done();
      });
      return Ok(undefined);
    } catch (error) {
      return Err(
        `Failed to register routes: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  /**
   * Starts the server listening on a specified port.
   * @param port The port number on which the server should listen.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async listen(port: number): Promise<Result<void, string>> {
    try {
      await this.server.listen({ host: "0.0.0.0", port });
      return Ok(undefined);
    } catch (err) {
      return Err(
        `Error to start server: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
