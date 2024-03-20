import {
  FastifyPluginCallback,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger,
} from "fastify";

export interface IUseCallback
  extends FastifyPluginCallback<
    { prefix: string },
    RawServerDefault,
    FastifyTypeProvider,
    FastifyBaseLogger
  > {}
