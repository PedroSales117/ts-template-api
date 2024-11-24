import axios from 'axios';
import { AdapterReply, AdapterRequest } from '../configurations/adapters/server.adapter';
import logger from '../utils/logger';

export class AuthMiddleware {
    /**
     * Middleware to validate JWT token from Authorization header.
     * Attaches decoded token to the request object for further use.
     * 
     * @param request - AdapterRequest containing the Authorization header.
     * @param reply - AdapterReply used to send responses in case of errors.
     * @returns Promise<void> - Continues the request if token is valid.
     */
    async authenticate(request: AdapterRequest, reply: AdapterReply) {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn('Bearer token is missing or invalid');
            reply.status(401).send({ message: "Missing or invalid Authorization header" });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            // Call the Authentication API to validate the token
            const response = await axios.post(
                `${process.env.AUTH_APP_URL}/auth/validate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data || !response.data.id) {
                reply.status(401).send({ message: "Invalid token" });
                return;
            }

            // If valid, allow the request to proceed
            logger.info('Token validated successfully');
            return;
        } catch (error) {
            logger.error(`Token validation failed: ${error.message}`);
            reply.status(401).send({ message: "Failed to validate token" });
        }
    }
}
