import { HttpStatus } from '../../../src/helpers/http-status.helper';
import { StatusCodes } from 'http-status-codes';

describe('HttpStatus Helper', () => {
    it('should map all defined status codes correctly', () => {
        expect(HttpStatus.OK).toBe(StatusCodes.OK);
        expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(HttpStatus.BAD_REQUEST).toBe(StatusCodes.BAD_REQUEST);
        expect(HttpStatus.CREATED).toBe(StatusCodes.CREATED);
        expect(HttpStatus.NO_CONTENT).toBe(StatusCodes.NO_CONTENT);
        expect(HttpStatus.NOT_FOUND).toBe(StatusCodes.NOT_FOUND);
    });

    it('should be frozen/immutable', () => {
        expect(Object.isFrozen(HttpStatus)).toBe(true);
        expect(() => {
            Object.defineProperty(HttpStatus, 'NEW_STATUS', {
                value: 999
            });
        }).toThrow();
    });

    it('should match standard HTTP status codes', () => {
        Object.entries(HttpStatus).forEach(([key, value]) => {
            expect(value).toBe(StatusCodes[key as keyof typeof StatusCodes]);
        });
    });
});