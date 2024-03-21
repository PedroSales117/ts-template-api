import { Result } from "../helpers/result.helper";
import { IRouter, IUseCallback } from "./";

export interface IServer {
  use(prefix: string, opts: IUseCallback): Promise<Result<void, string>>;
  useRouters(routers: IRouter[]): Promise<Result<void, string>>;
  listen(port: number): Promise<Result<void, string>>;
}
