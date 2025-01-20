import { Ok, Err, Result, ResultAsync } from '../../../src/helpers/result.helper';

describe('Result Helper', () => {
    describe('Ok', () => {
        it('should create a success result', () => {
            const result = Ok('success');
            expect(result.isOk()).toBe(true);
            expect(result.isErr()).toBe(false);
        });

        it('should unwrap the correct value', () => {
            const value = 'test value';
            const result = Ok(value);

            result.match(
                (val) => expect(val).toBe(value),
                () => fail('Should not reach error case')
            );
        });

        it('should work with complex types', () => {
            interface TestType {
                id: number;
                name: string;
            }

            const complexValue: TestType = {
                id: 1,
                name: 'test'
            };

            const result = Ok<TestType, Error>(complexValue);
            expect(result.isOk()).toBe(true);

            result.match(
                (val) => {
                    expect(val.id).toBe(complexValue.id);
                    expect(val.name).toBe(complexValue.name);
                },
                () => fail('Should not reach error case')
            );
        });
    });

    describe('Err', () => {
        it('should create an error result', () => {
            const result = Err(new Error('test error'));
            expect(result.isErr()).toBe(true);
            expect(result.isOk()).toBe(false);
        });

        it('should contain the correct error message', () => {
            const errorMessage = 'test error message';
            const result = Err(new Error(errorMessage));

            result.match(
                () => fail('Should not reach success case'),
                (error) => expect(error.message).toBe(errorMessage)
            );
        });

        it('should work with custom error types', () => {
            class CustomError extends Error {
                constructor(public code: string, message: string) {
                    super(message);
                    this.code = code;
                }
            }

            const customError = new CustomError('E001', 'custom error');
            const result = Err(customError);

            result.match(
                () => fail('Should not reach success case'),
                (error) => {
                    expect(error instanceof CustomError).toBe(true);
                    expect((error as CustomError).code).toBe('E001');
                }
            );
        });
    });

    describe('Result Type', () => {
        it('should handle chaining with map', () => {
            const result: Result<number, Error> = Ok(5);
            const doubled = result.map(x => x * 2);

            doubled.match(
                (val) => expect(val).toBe(10),
                () => fail('Should not reach error case')
            );
        });

        it('should handle chaining with mapErr', () => {
            const originalError = new Error('original');
            const result: Result<number, Error> = Err(originalError);

            const mapped = result.mapErr(error => new Error(`mapped: ${error.message}`));

            mapped.match(
                () => fail('Should not reach success case'),
                (error) => expect(error.message).toBe('mapped: original')
            );
        });

        it('should support async operations', async () => {
            const asyncOperation = async () => {
                return ResultAsync.fromPromise(
                    Promise.resolve(42),
                    error => error as Error
                );
            };

            const result = await asyncOperation();

            result.match(
                (val) => expect(val).toBe(42),
                () => fail('Should not reach error case')
            );
        });
    });

    describe('ResultAsync', () => {
        it('should handle async success', async () => {
            const promise = Promise.resolve(123);
            const result = ResultAsync.fromPromise(
                promise,
                error => error as Error
            );

            const value = await result;
            expect(value.isOk()).toBe(true);

            value.match(
                (val) => expect(val).toBe(123),
                () => fail('Should not reach error case')
            );
        });

        it('should handle async errors', async () => {
            const errorMessage = 'async error';
            const promise = Promise.reject(new Error(errorMessage));
            const result = ResultAsync.fromPromise(
                promise,
                error => error as Error
            );

            const value = await result;
            expect(value.isErr()).toBe(true);

            value.match(
                () => fail('Should not reach success case'),
                (error) => expect(error.message).toBe(errorMessage)
            );
        });

        it('should support chaining async operations', async () => {
            const result = await ResultAsync.fromPromise(
                Promise.resolve(5),
                error => error as Error
            ).map(async num => num * 2);

            result.match(
                (val) => expect(val).toBe(10),
                () => fail('Should not reach error case')
            );
        });
    });
});