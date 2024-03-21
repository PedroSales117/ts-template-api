import Fastify, { FastifyInstance } from "fastify";
import { IRouter, IRoute, IUseCallback } from "../../interfaces";
import { Result, Ok, Err } from "../../helpers/result.helper";

export class ServerAdapter {
  private server: FastifyInstance;

  constructor() {
    this.server = Fastify({ logger: true });
  }

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
