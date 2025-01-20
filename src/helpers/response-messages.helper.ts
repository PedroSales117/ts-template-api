export interface ServiceResponse<T = void> {
    code: string;
    message: string;
    data?: T;
}

export const ResponseMessages = Object.freeze({
    PRODUCT_CREATED: 'PRODUCT_CREATED',
    PRODUCTS_CREATED: 'PRODUCTS_CREATED',
    PRODUCTS_FETCHED: 'PRODUCTS_FETCHED',
    PRODUCT_FETCHED: 'PRODUCT_FETCHED',
    PRODUCT_UPDATED: 'PRODUCT_UPDATED',
    PRODUCT_DELETED: 'PRODUCT_DELETED',
    SEARCH_COMPLETED: 'SEARCH_COMPLETED',

    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    INVALID_SEARCH_TERM: 'INVALID_SEARCH_TERM'
} as const);

export type ResponseMessage = typeof ResponseMessages[keyof typeof ResponseMessages];