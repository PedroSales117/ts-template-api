import { DataSource } from 'typeorm';

/**
 * Validates the presence and types of required environment variables and throws an error if any are missing or invalid.
 * Ensures that DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, and NODE_ENV are set correctly before proceeding.
 */
if (!process.env.DB_USERNAME || typeof process.env.DB_USERNAME !== 'string') {
  throw new Error("Missing or invalid environment variable: DB_USERNAME");
}

if (!process.env.DB_PASSWORD || typeof process.env.DB_PASSWORD !== 'string') {
  throw new Error("Missing or invalid environment variable: DB_PASSWORD");
}

if (!process.env.DB_HOST || typeof process.env.DB_HOST !== 'string') {
  throw new Error("Missing or invalid environment variable: DB_HOST");
}

if (!process.env.DB_PORT || isNaN(Number(process.env.DB_PORT))) {
  throw new Error("Missing or invalid environment variable: DB_PORT");
}

if (!process.env.DB_NAME || typeof process.env.DB_NAME !== 'string') {
  throw new Error("Missing or invalid environment variable: DB_NAME");
}

if (!process.env.NODE_ENV || (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production')) {
  throw new Error("Missing or invalid environment variable: NODE_ENV");
}

/**
 * Determines if the current environment is development based on the NODE_ENV variable.
 * @type {boolean} `true` if the environment is development, `false` otherwise.
 */
const isDevelopment: boolean = process.env.NODE_ENV === 'development';

/**
 * Configures and initializes the TypeORM DataSource for connecting to the database.
 * The configuration is dynamic and adjusts based on the environment (development or production).
 * 
 * @type {DataSource}
 * @property {string} type - The type of the database (PostgreSQL).
 * @property {string} host - The database host, retrieved from environment variables.
 * @property {number} port - The database port, retrieved from environment variables.
 * @property {string} username - The database username, retrieved from environment variables.
 * @property {string} password - The database password, retrieved from environment variables.
 * @property {string} database - The database name, retrieved from environment variables.
 * @property {boolean} synchronize - Whether to synchronize the database schema, enabled in development only.
 * @property {boolean} logging - Whether to enable SQL query logging, enabled in development only.
 * @property {Array} entities - List of entities to be used by TypeORM.
 * @property {Array} migrations - Paths to the migration files.
 * @property {Array} subscribers - Optional subscribers for TypeORM events.
 */
export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: isDevelopment,
  logging: isDevelopment,
  entities: [],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;
