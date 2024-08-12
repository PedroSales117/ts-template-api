/**
 * Extends the ProcessEnv interface in the NodeJS namespace to include custom environment variables.
 * This ensures that TypeScript recognizes the environment variables used in the project and provides type safety.
 */
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /**
             * The port number on which the server should listen.
             * This variable is typically defined in the environment configuration.
             * @type {number}
             */
            PORT: number;
        }
    }
}

/**
 * Empty export to convert the file into a module, enabling TypeScript's module scope.
 */
export { }
