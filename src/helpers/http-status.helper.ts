import { StatusCodes } from "http-status-codes";

/**
 * A mapping object for HTTP status codes to enhance readability and maintainability
 * throughout the application. It leverages the `http-status-codes` library for
 * consistent status code references.
 *
 * It's intended to be expanded with additional status codes as needed.
 */
export const HttpStatus = Object.freeze({
  OK: StatusCodes.OK,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  CREATED: StatusCodes.CREATED,
  NO_CONTENT: StatusCodes.NO_CONTENT,
  NOT_FOUND: StatusCodes.NOT_FOUND,
} as const);

export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];