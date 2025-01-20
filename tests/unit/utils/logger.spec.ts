import logger from '../../../src/utils/logger';

describe('Logger', () => {
    let originalConsole: typeof console;
    let realDate: typeof Date;

    beforeAll(() => {
        originalConsole = global.console;
        realDate = global.Date;
    });

    beforeEach(() => {
        // Mock do console
        global.console = {
            ...console,
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        };

        // Mock do Date
        const mockDate = new Date('2024-01-19T12:00:00.000Z');
        global.Date = class extends realDate {
            constructor() {
                super();
                return mockDate;
            }
        } as typeof Date;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        global.console = originalConsole;
        global.Date = realDate;
    });

    describe('Log Levels', () => {
        it('should log info messages correctly', () => {
            logger.info('Test info message');

            expect(console.info).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [INFO]: Test info message'
            );
        });

        it('should log warn messages correctly', () => {
            logger.warn('Test warning message');

            expect(console.warn).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [WARN]: Test warning message'
            );
        });

        it('should log error messages correctly', () => {
            logger.error('Test error message');

            expect(console.error).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [ERROR]: Test error message'
            );
        });
    });

    describe('Metadata Handling', () => {
        it('should format metadata correctly', () => {
            const metadata = { userId: 123, action: 'test' };
            logger.info('Message with metadata', metadata);

            expect(console.info).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [INFO]: Message with metadata {"userId":123,"action":"test"}'
            );
        });

        it('should handle undefined metadata', () => {
            logger.info('Message without metadata');

            expect(console.info).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [INFO]: Message without metadata'
            );
        });

        it('should handle empty metadata object', () => {
            logger.info('Message with empty metadata', {});

            expect(console.info).toHaveBeenCalledWith(
                '[2024-01-19T12:00:00.000Z] [INFO]: Message with empty metadata'
            );
        });

        it('should handle complex metadata types', () => {
            const complexMetadata = {
                array: [1, 2, 3],
                nested: { key: 'value' },
                nullValue: null,
                undefinedValue: undefined,
                simpleDate: '2024-01-19'
            };

            logger.info('Complex metadata', complexMetadata);

            const loggedMessage = (console.info as jest.Mock).mock.calls[0][0];
            expect(loggedMessage).toContain('[INFO]: Complex metadata');
            expect(loggedMessage).toContain('"array":[1,2,3]');
            expect(loggedMessage).toContain('"key":"value"');
        });
    });

    describe('Timestamp Format', () => {
        it('should use ISO format for timestamp', () => {
            logger.info('Test message');

            expect(console.info).toHaveBeenCalledWith(
                expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
            );
        });
    });

    describe('Error Cases', () => {
        it('should handle circular references in metadata', () => {
            const circularObj: any = { key: 'value' };
            circularObj.self = circularObj;

            logger.info('Circular reference', circularObj);

            const loggedMessage = (console.info as jest.Mock).mock.calls[0][0];
            expect(loggedMessage).toContain('[Circular Reference]');
        });

        it('should handle failed JSON stringification', () => {
            const problematicObj = {
                toJSON: () => { throw new Error('JSON error'); }
            };

            logger.info('Problematic object', problematicObj);

            const loggedMessage = (console.info as jest.Mock).mock.calls[0][0];
            expect(loggedMessage).toContain('[Unable to stringify metadata]');
        });
    });

    describe('Multiple Calls', () => {
        it('should maintain order of log messages', () => {
            logger.info('First');
            logger.warn('Second');
            logger.error('Third');

            expect(console.info).toHaveBeenCalledWith(expect.stringContaining('First'));
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Second'));
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Third'));

            const infoCall = (console.info as jest.Mock).mock.invocationCallOrder[0];
            const warnCall = (console.warn as jest.Mock).mock.invocationCallOrder[0];
            const errorCall = (console.error as jest.Mock).mock.invocationCallOrder[0];

            expect(infoCall).toBeLessThan(warnCall);
            expect(warnCall).toBeLessThan(errorCall);
        });
    });
});