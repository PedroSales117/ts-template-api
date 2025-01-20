import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { ServerAdapter } from '../../../src/configurations/adapters/server.adapter';
import logger from '../../../src/utils/logger';
import { IRoute, IRouter } from '../../../src/interfaces';
import { HttpMethod } from '../../../src/helpers/http-method.helper';

jest.mock('fastify', () => {
    const mockRoute = jest.fn();
    const mockListen = jest.fn();
    const mockRegister = jest.fn();
    const mockAddHook = jest.fn();
    const mockSetErrorHandler = jest.fn();

    return jest.fn(() => ({
        route: mockRoute,
        listen: mockListen,
        register: mockRegister,
        addHook: mockAddHook,
        setErrorHandler: mockSetErrorHandler
    }));
});

jest.mock('@fastify/jwt');
jest.mock('../../../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

describe('ServerAdapter', () => {
    let serverAdapter: ServerAdapter;
    let mockFastify: jest.Mocked<FastifyInstance>;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.NODE_ENV = 'test';
        serverAdapter = new ServerAdapter();
        // @ts-ignore - acessando a instância privada para testes
        mockFastify = serverAdapter['server'];
    });

    describe('Constructor', () => {
        it('should initialize with correct configurations', () => {
            expect(mockFastify.register).toHaveBeenCalledWith(
                fastifyJwt,
                { secret: 'test-secret' }
            );
            expect(mockFastify.addHook).toHaveBeenCalled();
            expect(mockFastify.setErrorHandler).toHaveBeenCalled();
        });

        it('should set up CORS headers correctly', async () => {
            const mockRequest = {} as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                '*'
            );
            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Credentials',
                'true'
            );
        });

        it('should set all required CORS headers', async () => {
            const mockRequest = {} as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Headers',
                expect.stringContaining('Authorization')
            );
            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Methods',
                expect.stringContaining('OPTIONS')
            );
        });

        it('should use custom ALLOW_ORIGIN when provided', async () => {
            process.env.ALLOW_ORIGIN = 'http://localhost:3000';
            const mockRequest = {} as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                'http://localhost:3000'
            );
        });

        it('should include all required headers in CORS configuration', async () => {
            const mockRequest = {} as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Headers',
                'Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID'
            );
        });

        it('should handle OPTIONS requests with missing headers', async () => {
            delete process.env.ALLOW_ORIGIN;
            const mockRequest = { method: 'OPTIONS' } as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.send).toHaveBeenCalled();
            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                '*'
            );
        });


        it('should handle OPTIONS requests for endpoints with middlewares', async () => {
            const mockRequest = { method: 'OPTIONS' } as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.send).toHaveBeenCalled();
            expect(mockReply.header).toHaveBeenCalledWith(
                'Access-Control-Allow-Methods',
                expect.stringContaining('OPTIONS')
            );
        });


        it('should handle OPTIONS requests correctly', async () => {
            const mockRequest = { method: 'OPTIONS' } as FastifyRequest;
            const mockReply = {
                header: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [[, hookCallback]] = (mockFastify.addHook as jest.Mock).mock.calls;
            await hookCallback(mockRequest, mockReply);

            expect(mockReply.send).toHaveBeenCalled();
        });
    });

    describe('use', () => {
        it('should register middleware successfully', async () => {
            const mockMiddleware = jest.fn();
            const result = await serverAdapter.use('/test', mockMiddleware);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.register).toHaveBeenCalledWith(
                mockMiddleware,
                { prefix: '/test' }
            );
        });

        it('should return Ok when middleware is successfully registered', async () => {
            const mockMiddleware = jest.fn();
            const result = await serverAdapter.use('/test', mockMiddleware);

            expect(result.isOk()).toBe(true);
            result.match(
                (ok) => expect(ok).toBeUndefined(),
                () => fail('Should not reach error case')
            );
        });

        it('should handle TypeError during middleware registration', async () => {
            const result = await serverAdapter.use('/invalid', null as any);

            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Middleware must be a valid function')
            );
        });


        it('should handle async errors during middleware registration', async () => {
            const error = new Error('Async middleware error');
            (mockFastify.register as jest.Mock).mockRejectedValueOnce(error);

            const result = await serverAdapter.use('/test', jest.fn());
            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Async middleware error')
            );
        });


        it('should handle middleware registration errors', async () => {
            const error = new Error('Middleware error');
            (mockFastify.register as jest.Mock).mockRejectedValueOnce(error);

            const result = await serverAdapter.use('/test', jest.fn());

            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Failed to use middleware')
            );
        });
    });

    describe('useRouters', () => {
        it('should register routes successfully', async () => {
            const mockHandler = jest.fn();
            const mockRouter: IRouter = {
                getRoutes: () => [{
                    method: HttpMethod.GET,
                    path: '/test',
                    handler: mockHandler
                }],
                addRoute: function (route: IRoute): void {
                    throw new Error('Function not implemented.');
                }
            };

            const result = await serverAdapter.useRouters([mockRouter]);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.route).toHaveBeenCalledWith({
                method: HttpMethod.GET,
                url: '/api/test',
                handler: mockHandler,
                preHandler: []
            });
        });

        it('should register routes with middlewares', async () => {
            const mockMiddleware = jest.fn();
            const mockHandler = jest.fn();
            const mockRouter: IRouter = {
                getRoutes: () => [{
                    method: HttpMethod.POST,
                    path: '/test',
                    handler: mockHandler,
                    middlewares: [mockMiddleware]
                }],
                addRoute: function (route: IRoute): void {
                    throw new Error('Function not implemented.');
                }
            };

            const result = await serverAdapter.useRouters([mockRouter]);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.route).toHaveBeenCalledWith({
                method: HttpMethod.POST,
                url: '/api/test',
                handler: mockHandler,
                preHandler: [mockMiddleware]
            });
        });

        it('should handle route registration errors', async () => {
            const error = new Error('Route error');
            (mockFastify.route as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            const mockRouter: IRouter = {
                getRoutes: () => [{
                    method: HttpMethod.GET,
                    path: '/test',
                    handler: jest.fn()
                }],
                addRoute: function (route: IRoute): void {
                    throw new Error('Function not implemented.');
                }
            };

            const result = await serverAdapter.useRouters([mockRouter]);

            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Failed to register routes')
            );
        });

        it('should handle empty router list', async () => {
            const result = await serverAdapter.useRouters([]);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.route).not.toHaveBeenCalled();
        });

        it('should register multiple routes from a single router', async () => {
            const mockHandler1 = jest.fn();
            const mockHandler2 = jest.fn();
            const mockRouter: IRouter = {
                getRoutes: () => [
                    { method: HttpMethod.GET, path: '/route1', handler: mockHandler1 },
                    { method: HttpMethod.POST, path: '/route2', handler: mockHandler2 },
                ],
                addRoute: () => { /* not implemented */ }
            };

            const result = await serverAdapter.useRouters([mockRouter]);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.route).toHaveBeenCalledWith({
                method: HttpMethod.GET,
                url: '/api/route1',
                handler: mockHandler1,
                preHandler: []
            });
            expect(mockFastify.route).toHaveBeenCalledWith({
                method: HttpMethod.POST,
                url: '/api/route2',
                handler: mockHandler2,
                preHandler: []
            });
        });

        it('should handle errors when registering routes with middlewares', async () => {
            const error = new Error('Route with middleware error');
            (mockFastify.route as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            const mockRouter: IRouter = {
                getRoutes: () => [{
                    method: HttpMethod.POST,
                    path: '/test',
                    handler: jest.fn(),
                    middlewares: [jest.fn()],
                }],
                addRoute: () => { /* not implemented */ }
            };

            const result = await serverAdapter.useRouters([mockRouter]);
            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Route with middleware error')
            );
        });

        it('should handle errors when registering multiple routes', async () => {
            const error = new Error('Route registration error');
            (mockFastify.route as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            const mockRouter: IRouter = {
                getRoutes: () => [
                    { method: HttpMethod.GET, path: '/test1', handler: jest.fn() },
                    { method: HttpMethod.POST, path: '/test2', handler: jest.fn() },
                ],
                addRoute: () => { /* not implemented */ }
            };

            const result = await serverAdapter.useRouters([mockRouter]);
            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => expect(errorMsg).toContain('Route registration error')
            );
        });

    });

    describe('listen', () => {
        it('should start server successfully', async () => {
            (mockFastify.listen as jest.Mock).mockResolvedValueOnce(undefined);

            const result = await serverAdapter.listen(3000);

            expect(result.isOk()).toBe(true);
            expect(mockFastify.listen).toHaveBeenCalledWith({
                host: '0.0.0.0',
                port: 3000
            });
            expect(logger.info).toHaveBeenCalled();
        });

        it('should handle server listen error', async () => {
            const error = new Error('Port in use');
            (mockFastify.listen as jest.Mock).mockRejectedValueOnce(error);

            const result = await serverAdapter.listen(3000);

            expect(result.isErr()).toBe(true);
            result.match(
                () => fail('Should not reach success case'),
                (errorMsg) => {
                    expect(errorMsg).toContain('Error starting server');
                    expect(logger.error).toHaveBeenCalled();
                }
            );
        });

        it('should log different messages based on environment', async () => {
            (mockFastify.listen as jest.Mock).mockResolvedValueOnce(undefined);

            process.env.NODE_ENV = 'development';
            await serverAdapter.listen(3000);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('happy debbuging'));

            process.env.NODE_ENV = 'production';
            await serverAdapter.listen(3000);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('time to get serious'));
        });

        it('should log the correct message based on environment', async () => {
            (mockFastify.listen as jest.Mock).mockResolvedValueOnce(undefined);

            process.env.NODE_ENV = 'test';
            await serverAdapter.listen(3000);
            expect(logger.info).toHaveBeenCalledWith(
                'Starting ------ test ------ environment, happy debbuging.'
            );

            process.env.NODE_ENV = 'production';
            await serverAdapter.listen(3000);
            expect(logger.info).toHaveBeenCalledWith(
                'Starting ------ production ------ environment, time to get serious!'
            );
        });

        it('should handle undefined NODE_ENV', async () => {
            process.env.NODE_ENV = undefined as any;

            (mockFastify.listen as jest.Mock).mockResolvedValueOnce(undefined);

            const result = await serverAdapter.listen(3000);
            expect(result.isOk()).toBe(true);
            expect(logger.info).toHaveBeenCalledWith(
                expect.stringContaining('Starting ------ undefined ------ environment')
            );
        });

        it('should handle unexpected NODE_ENV values', async () => {
            process.env.NODE_ENV = 'staging' as any;

            (mockFastify.listen as jest.Mock).mockResolvedValueOnce(undefined);

            const result = await serverAdapter.listen(3000);
            expect(result.isOk()).toBe(true);
            expect(logger.info).toHaveBeenCalledWith(
                expect.stringContaining('Starting ------ staging ------ environment')
            );
        });

    });

    describe('Error Handler', () => {
        it('should handle errors correctly', () => {
            const mockError = new Error('Test error');
            const mockRequest = {
                method: 'GET',
                url: '/test'
            } as FastifyRequest;
            const mockReply = {
                sent: false,
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [errorHandler] = (mockFastify.setErrorHandler as jest.Mock).mock.calls[0];
            errorHandler(mockError, mockRequest, mockReply);

            expect(logger.error).toHaveBeenCalled();
            expect(mockReply.status).toHaveBeenCalledWith(500);
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Test error'
            });
        });

        it('should not send response if already sent', () => {
            const mockError = new Error('Test error');
            const mockRequest = {
                method: 'GET',
                url: '/test'
            } as FastifyRequest;
            const mockReply = {
                sent: true,
                status: jest.fn(),
                send: jest.fn()
            } as unknown as FastifyReply;

            const [errorHandler] = (mockFastify.setErrorHandler as jest.Mock).mock.calls[0];
            errorHandler(mockError, mockRequest, mockReply);

            expect(logger.error).toHaveBeenCalled();
            expect(mockReply.status).not.toHaveBeenCalled();
            expect(mockReply.send).not.toHaveBeenCalled();
        });
    });
});