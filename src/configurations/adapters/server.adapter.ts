import pino from 'pino';
import { loggerOptions } from './configurations/logger';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { IRouter, IUseCallback } from '../../interfaces';
import { Result, Ok, Err } from '../../helpers/result.helper';
import logger from '../../utils/logger';

/**
 * Configures the Pino logger with specific settings, including the log level and formatting options.
 */
export const adapterLogger = pino(loggerOptions);

/**
 * ServerAdapter provides an abstraction layer over the Fastify framework,
 * allowing for the easy setup and management of routes, middlewares, and server configuration.
 */

export type AdapterRequest = FastifyRequest
export type AdapterReply = FastifyReply

export class ServerAdapter {
  private server: FastifyInstance; // The underlying Fastify server instance.

  /**
   * Initializes the server with Fastify, setting default configurations,
   * such as body size limits, JWT support, and CORS headers.
   */
  constructor() {
    this.server = Fastify({
      logger: true, // Enables built-in Fastify logging.
      bodyLimit: 30 * 1024 * 1024, // Sets the maximum request body size to 30 MB.
    });

    // Register the fastify-cookie plugin for cookie handling.
    this.server.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET as string, // Used for signed cookies (optional).
    });

    // Registering the fastify-jwt plugin for JWT validation.
    this.server.register(fastifyJwt, {
      secret: process.env.JWT_SECRET as string, // The secret key for signing and verifying tokens.
    });

    // Add a hook to handle CORS and OPTIONS requests.
    this.server.addHook('onRequest', async (request, reply) => {
      reply.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '*');
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID'
      );
      reply.header(
        'Access-Control-Allow-Methods',
        'OPTIONS, POST, PUT, PATCH, GET, DELETE'
      );
      if (request.method === 'OPTIONS') {
        reply.send(); // Handle preflight requests for CORS.
      }
    });

    // Add a global error handler to manage uncaught exceptions during request processing.
    this.server.setErrorHandler((error, request, reply) => {
      logger.error(`Error during request ${request.method} ${request.url}:`, error);

      if (!reply.sent) {
        reply.status(500).send({ message: error.message || 'Internal Server Error' });
      }
    });
  }

  /**
   * Registers a middleware or a series of middlewares to the server with an optional prefix.
   * Useful for modular configurations like authentication, logging, or validation logic.
   * 
   * @param prefix - The URL prefix for all paths associated with the middleware.
   * @param opts - Middleware function or object describing the middleware behavior.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async use(prefix: string, opts: IUseCallback): Promise<Result<void, string>> {
    try {
      await this.server.register(opts, { prefix });
      return Ok(undefined);
    } catch (error) {
      return Err(
        `Failed to use middleware: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Registers an array of routers, each containing multiple routes, to the server.
   * The routes are automatically prefixed with `/api` for consistency.
   * 
   * @param routers - An array of IRouter instances managing multiple routes.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async useRouters(routers: IRouter[]): Promise<Result<void, string>> {
    try {
      for (const router of routers) {
        for (const route of router.getRoutes()) {
          this.server.route({
            method: route.method, // The HTTP method (GET, POST, DELETE, etc.).
            url: `/api${route.path}`, // Prepend "/api" to all routes.
            preHandler: route.middlewares || [], // Attach any middlewares to the route.
            handler: route.handler, // The main handler for processing requests.
          });
        }
      }
      return Ok(undefined);
    } catch (error) {
      return Err(
        `Failed to register routes: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Starts the server, initializes the database connection, and listens on a specified port.
   * Handles database connection failures gracefully.
   * 
   * @param port - The port number on which the server will listen.
   * @returns A Result indicating success (Ok) or an error message (Err).
   */
  async listen(port: number): Promise<Result<void, string>> {
    try {
      // Start the Fastify server on the specified port.
      await this.server.listen({ host: '0.0.0.0', port });
      return Ok(undefined);
    } catch (error) {
      logger.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
      return Err(
        `Error starting server: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
