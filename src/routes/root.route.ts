import { HttpStatus } from "../helpers/http-status.helper";
import { IRouter } from "../interfaces";
import { Router } from "./Router";

export const rootRoute = (): IRouter => {
  const root_router = new Router();

  root_router.addRoute({
    path: "/status",
    method: "GET",
    handler: async (_request, reply) => {
      reply.status(HttpStatus.OK).send({
        status: "up",
      });
    },
  });

  return root_router;
};
