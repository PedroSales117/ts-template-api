import { HttpMethod } from '../../../src/helpers/http-method.helper';

describe('HttpMethod Helper', () => {
    it('should define all standard HTTP methods', () => {
        expect(HttpMethod.GET).toBe('GET');
        expect(HttpMethod.POST).toBe('POST');
        expect(HttpMethod.PUT).toBe('PUT');
        expect(HttpMethod.DELETE).toBe('DELETE');
        expect(HttpMethod.PATCH).toBe('PATCH');
        expect(HttpMethod.HEAD).toBe('HEAD');
        expect(HttpMethod.OPTIONS).toBe('OPTIONS');
    });

    it('should be frozen/immutable', () => {
        expect(Object.isFrozen(HttpMethod)).toBe(true);
        // Tentativa de modificação deve lançar erro em modo estrito
        expect(() => {
            Object.defineProperty(HttpMethod, 'NEW_METHOD', {
                value: 'TEST'
            });
        }).toThrow();
    });

    it('should contain all necessary HTTP methods for the application', () => {
        const requiredMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        const enumValues = Object.values(HttpMethod);
        requiredMethods.forEach(method => {
            expect(enumValues).toContain(method);
        });
    });
});