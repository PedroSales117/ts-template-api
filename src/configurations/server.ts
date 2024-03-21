import { ServerAdapter } from "./adapters/server.adapter";
import { IServer, IRouter, IUseCallback } from "../interfaces";
import { Result } from "../helpers/result.helper";

export class HttpServer implements IServer {
  private adapter: ServerAdapter;

  constructor() {
    this.adapter = new ServerAdapter();
  }

  async use(prefix: string, opts: IUseCallback): Promise<Result<void, string>> {
    return this.adapter.use(prefix, opts);
  }

  async useRouters(routers: IRouter[]): Promise<Result<void, string>> {
    return this.adapter.useRouters(routers);
  }

  async listen(port: number): Promise<Result<void, string>> {
    return this.adapter.listen(port);
  }
}
