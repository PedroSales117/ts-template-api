import {
  FastifyPluginCallback,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger,
} from "fastify";

/**
 * Defines a specialized type for Fastify plugin callbacks that include a prefix option.
 * This interface extends `FastifyPluginCallback` to provide a standardized way to register
 * plugins or middleware with Fastify, including a `prefix` for the routes that the plugin might handle.
 *
 * The `IUseCallback` interface can be used to define functions that are intended to be registered as
 * Fastify plugins or middleware, facilitating the addition of functionality to a Fastify server instance
 * with type safety and IDE support.
 *
 * @extends {FastifyPluginCallback} Inherits types for options, server, type provider, and logger from `FastifyPluginCallback`.
 */
export interface IUseCallback
  extends FastifyPluginCallback<
    { prefix: string }, // The specific plugin options, including `prefix`.
    RawServerDefault, // The server type, typically using Fastify's default server type.
    FastifyTypeProvider, // Allows for specifying custom types for the request and reply objects.
    FastifyBaseLogger // The logger type, facilitating logging within the plugin or middleware.
  > {}
