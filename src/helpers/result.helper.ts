import { Result as R, ok, err, ResultAsync as RAsync } from "neverthrow";

/**
 * Re-exports the Result type from the `neverthrow` package, enabling typed results with success or error states.
 * This is a generic type that encapsulates either a success value (`T`) or an error (`E`), promoting explicit error handling.
 *
 * @type {Result<T, E>} The generic Result type, where `T` is the type of the success value and `E` is the type of the error.
 */
export type Result<T, E> = R<T, E>;

/**
 * Re-exports the `ResultAsync` type from the `neverthrow` package, which enables asynchronous handling of results
 * with success or error states. This is useful for dealing with promises that can either resolve successfully or
 * reject with an error.
 *
 * @type {ResultAsync<T, E>} The generic ResultAsync type, where `T` is the type of the success value and `E` is the type of the error.
 */
export const ResultAsync = RAsync;

/**
 * Re-exports the `ok` function from the `neverthrow` package, providing a convenient way to create a `Result` instance representing success.
 *
 * @param value The value to be wrapped in a success Result.
 * @returns {Result<T, E>} A Result object encapsulating the success value.
 */
export const Ok = ok;

/**
 * Re-exports the `err` function from the `neverthrow` package, offering a straightforward method to create a `Result` instance denoting an error.
 *
 * @param error The error to be wrapped in an error Result.
 * @returns {Result<T, E>} A Result object encapsulating the error.
 */
export const Err = err;
