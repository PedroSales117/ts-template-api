import { StatusCodes } from "http-status-codes";

/**
 * A mapping object for HTTP status codes to enhance readability and maintainability
 * throughout the application. It leverages the `http-status-codes` library for
 * consistent status code references.
 *
 * It's intended to be expanded with additional status codes as needed.
 */
export const HttpStatus = {
  OK: StatusCodes.OK, // Represents a 200 OK HTTP status code.
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,  // Represents a 500 INTERNAL_SERVER_ERROR HTTP status code.
  BAD_REQUEST: StatusCodes.BAD_REQUEST,  // Represents a 400 BAD_REQUEST HTTP status code.
};
