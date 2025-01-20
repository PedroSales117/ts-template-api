import { AuthMiddleware } from '../../../src/middlewares/Auth.middleware';
import { AdapterRequest, AdapterReply } from '../../../src/configurations/adapters/server.adapter';
import axios from 'axios';
import logger from '../../../src/utils/logger';

// Mock das dependências
jest.mock('axios');
jest.mock('../../../src/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}));

describe('AuthMiddleware', () => {
    let authMiddleware: AuthMiddleware;
    let mockRequest: Partial<AdapterRequest>;
    let mockReply: Partial<AdapterReply>;
    
    beforeEach(() => {
        process.env.ADMIN_AUTH_APP_URL = 'http://auth-api';
        
        authMiddleware = new AuthMiddleware();
        
        mockRequest = {
            headers: {
                authorization: 'Bearer valid-token'
            }
        };

        mockReply = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        jest.clearAllMocks();
    });

    it('should validate token successfully', async () => {
        const mockResponse = { data: { id: '123' } };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(axios.post).toHaveBeenCalledWith(
            'http://auth-api/auth/validate',
            {},
            { headers: { Authorization: 'Bearer valid-token' } }
        );
        expect(mockReply.status).not.toHaveBeenCalled();
        expect(mockReply.send).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Token validated successfully');
    });

    it('should reject missing authorization header', async () => {
        mockRequest.headers = {};

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Missing or invalid Authorization header'
        });
        expect(logger.warn).toHaveBeenCalledWith('Bearer token is missing or invalid');
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('should reject invalid authorization format', async () => {
        mockRequest.headers = { authorization: 'InvalidFormat token' };

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Missing or invalid Authorization header'
        });
        expect(logger.warn).toHaveBeenCalledWith('Bearer token is missing or invalid');
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('should reject when auth service returns invalid response', async () => {
        const mockResponse = { data: {} }; // Missing id
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Invalid token'
        });
    });

    it('should handle auth service errors', async () => {
        const error = new Error('Network error');
        (axios.post as jest.Mock).mockRejectedValueOnce(error);

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Failed to validate token'
        });
        expect(logger.error).toHaveBeenCalledWith('Token validation failed: Network error');
    });

    it('should handle empty auth service response', async () => {
        const mockResponse = { data: null };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Invalid token'
        });
    });

    it('should use configured auth service URL', async () => {
        process.env.AUTH_APP_URL = 'http://custom-auth-url';
        const mockResponse = { data: { id: '123' } };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        await authMiddleware.authenticate(
            mockRequest as AdapterRequest,
            mockReply as AdapterReply
        );

        expect(axios.post).toHaveBeenCalledWith(
            'http://custom-auth-url/auth/validate',
            {},
            expect.any(Object)
        );
    });

    describe('Error Handling', () => {
        it('should handle auth service timeout', async () => {
            const timeoutError = new Error('Timeout');
            timeoutError.name = 'TimeoutError';
            (axios.post as jest.Mock).mockRejectedValueOnce(timeoutError);

            await authMiddleware.authenticate(
                mockRequest as AdapterRequest,
                mockReply as AdapterReply
            );

            expect(mockReply.status).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Failed to validate token'
            });
            expect(logger.error).toHaveBeenCalled();
        });

        it('should handle auth service 500 error', async () => {
            (axios.post as jest.Mock).mockRejectedValueOnce({
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' }
                }
            });

            await authMiddleware.authenticate(
                mockRequest as AdapterRequest,
                mockReply as AdapterReply
            );

            expect(mockReply.status).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Failed to validate token'
            });
            expect(logger.error).toHaveBeenCalled();
        });
    });
});