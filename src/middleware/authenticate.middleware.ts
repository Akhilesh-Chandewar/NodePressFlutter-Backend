import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import errorHandler from '../utils/errorHandler';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: any; 
        }
    }
}


// Middleware to authenticate requests
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;
        const secrete_key  = process.env.JWT_SECRETE

        if (!token) {
            throw new Error('Authentication failed');
        }

        // Verify the token
        const decodedToken: any = jwt.verify(token, `${secrete_key}`);
        

        // Check if the decoded token contains a userId
        if (!decodedToken.userId) {
            throw new Error('Invalid token');
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { id: parseInt(decodedToken.userId) }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Attach the user object to the request for further processing
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (err: any) {
        // Handle authentication errors
        errorHandler({ statusCode: 401, message: err.message }, req, res, next);
    }
};
