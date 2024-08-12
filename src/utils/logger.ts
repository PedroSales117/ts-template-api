import { adapterLogger } from "../configurations/adapters/server.adapter";

type LogLevel = 'info' | 'warn' | 'error';

/**
 * Logs a message with the specified log level.
 *
 * @param {LogLevel} level - The log level ('info', 'warn', 'error').
 * @param {string} message - The message to log.
 * @param {any} [error] - Optional error object to include in the log.
 */
const log = (level: LogLevel, message: string, error?: any) => {
  if (error) {
    adapterLogger[level](error, message); // Logs with an error if provided
  } else {
    adapterLogger[level](message); // Logs the message only
  }
};

/**
 * A logger object with methods for logging at different levels: info, warn, and error.
 */
const logger = {
  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   */
  info: (message: string) => log('info', message),

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   */
  warn: (message: string) => log('warn', message),

  /**
   * Logs an error message, optionally including an error object.
   * @param {string} message - The message to log.
   * @param {any} [error] - Optional error object to include in the log.
   */
  error: (message: string, error?: any) => log('error', message, error),
};

export default logger;
