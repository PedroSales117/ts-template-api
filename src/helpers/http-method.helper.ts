/**
 * Enum representing HTTP methods used in the application
 */
export const HttpMethod = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS'
} as const);

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];