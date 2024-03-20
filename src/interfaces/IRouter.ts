interface IRequest {
  body: unknown;
  query: unknown;
  params: unknown;
}

interface IReply {
  send: (body: unknown) => void;
  status: (statusCode: number) => IReply;
}

export interface IRoute {
  path: string;
  method: "GET";
  handler: (request: IRequest, reply: IReply) => Promise<unknown>;
}

export interface IRouter {
  addRoute(route: IRoute): void;
  getRoutes(): IRoute[];
}
