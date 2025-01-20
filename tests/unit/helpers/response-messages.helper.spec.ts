import { ResponseMessages, ServiceResponse } from '../../../src/helpers/response-messages.helper';

describe('ResponseMessages Helper', () => {
    describe('ResponseMessages Constants', () => {
        it('should define all success messages', () => {
            expect(ResponseMessages.PRODUCT_CREATED).toBe('PRODUCT_CREATED');
            expect(ResponseMessages.PRODUCTS_CREATED).toBe('PRODUCTS_CREATED');
            expect(ResponseMessages.PRODUCTS_FETCHED).toBe('PRODUCTS_FETCHED');
            expect(ResponseMessages.PRODUCT_FETCHED).toBe('PRODUCT_FETCHED');
            expect(ResponseMessages.PRODUCT_UPDATED).toBe('PRODUCT_UPDATED');
            expect(ResponseMessages.PRODUCT_DELETED).toBe('PRODUCT_DELETED');
            expect(ResponseMessages.SEARCH_COMPLETED).toBe('SEARCH_COMPLETED');
        });

        it('should be frozen/immutable', () => {
            expect(Object.isFrozen(ResponseMessages)).toBe(true);
            expect(() => {
                Object.defineProperty(ResponseMessages, 'NEW_MESSAGE', {
                    value: 'TEST'
                });
            }).toThrow();
        });

        it('should have unique values', () => {
            const values = Object.values(ResponseMessages);
            const uniqueValues = new Set(values);
            expect(values.length).toBe(uniqueValues.size);
        });
    });

    describe('ServiceResponse Interface', () => {
        it('should work with void data type', () => {
            const response: ServiceResponse = {
                code: ResponseMessages.PRODUCT_DELETED,
                message: 'Product deleted successfully'
            };
            expect(response.code).toBe(ResponseMessages.PRODUCT_DELETED);
            expect(response.message).toBeDefined();
            expect(response.data).toBeUndefined();
        });

        it('should work with specific data type', () => {
            interface TestData {
                id: number;
                name: string;
            }

            const response: ServiceResponse<TestData> = {
                code: ResponseMessages.PRODUCT_FETCHED,
                message: 'Product fetched successfully',
                data: {
                    id: 1,
                    name: 'Test'
                }
            };

            expect(response.code).toBe(ResponseMessages.PRODUCT_FETCHED);
            expect(response.message).toBeDefined();
            expect(response.data).toBeDefined();
            expect(response.data?.id).toBe(1);
            expect(response.data?.name).toBe('Test');
        });

        it('should work with array data type', () => {
            const response: ServiceResponse<string[]> = {
                code: ResponseMessages.PRODUCTS_FETCHED,
                message: 'Products fetched successfully',
                data: ['item1', 'item2']
            };

            expect(response.code).toBe(ResponseMessages.PRODUCTS_FETCHED);
            expect(response.message).toBeDefined();
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data).toHaveLength(2);
        });

        it('should enforce required properties', () => {
            // @ts-expect-error - code is required
            const invalidResponse1: ServiceResponse = {
                message: 'Missing code'
            };

            // @ts-expect-error - message is required
            const invalidResponse2: ServiceResponse = {
                code: ResponseMessages.PRODUCT_CREATED
            };

            const validResponse: ServiceResponse = {
                code: ResponseMessages.PRODUCT_CREATED,
                message: 'Valid response'
            };

            expect(validResponse.code).toBeDefined();
            expect(validResponse.message).toBeDefined();
        });
    });
});