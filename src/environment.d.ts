/**
 * Global declaration to extend the ProcessEnv interface in the NodeJS namespace.
 * This declaration allows adding types for the environment variables used in the project.
 */
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /**
             * API key for OpenAI.
             * @type {string}
             */
            OPENAI_API_KEY: string;
        }
    }
}

// Empty export to convert the file into a module.
export { }
