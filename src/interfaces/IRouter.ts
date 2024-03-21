interface IRequest<Body = unknown, Query = unknown, Params = unknown> {
  body: Body;
  query: Query;
  params: Params;
}

interface IReply {
  send: <Response>(body: Response) => void;
  status: (statusCode: number) => IReply;
}

export interface IRoute<
  Request extends IRequest = IRequest,
  Response = unknown,
> {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  handler: (request: Request, reply: IReply) => Promise<Response>;
}

export interface IRouter {
  addRoute(route: IRoute): void;
  getRoutes(): IRoute[];
}
