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

            /**
             * The database username, typically defined in the environment configuration.
             * @type {string}
             */
            DB_USERNAME: string;

            /**
             * The database password, typically defined in the environment configuration.
             * @type {string}
             */
            DB_PASSWORD: string;

            /**
             * The environment in which the application is running (e.g., 'development', 'production').
             * @type {string}
             */
            NODE_ENV: 'development' | 'production';

            /**
             * The database host, typically defined in the environment configuration.
             * @type {string}
             */
            DB_HOST: string;

            /**
             * The database port, typically defined in the environment configuration.
             * @type {string}
             */
            DB_PORT: string;

            /**
             * The database name, typically defined in the environment configuration.
             * @type {string}
             */
            DB_NAME: string;
        }
    }
}

/**
 * Empty export to convert the file into a module, enabling TypeScript's module scope.
 */
export { }
