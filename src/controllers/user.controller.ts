import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import sendResponse from '../utils/responseHandler';
import errorHandler from '../utils/errorHandler';

const prisma = new PrismaClient();

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            throw new Error('Missing required fields');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });
        sendResponse(res, 200, `${username} registered successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const secrete_key = process.env.JWT_SECRETE
        // Check if username and password are provided
        if (!username || !password) {
            throw new Error('Missing username or password');
        }

        // Find the user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        // Check if the user exists
        if (!user) {
            throw new Error('Invalid username or password');
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match, throw an error
        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, `${secrete_key}`, { expiresIn: '24h' });

        // Send the token in the response
        sendResponse(res, 200, 'Login successful', { token });
    } catch (err: any) {
        // Handle errors
        errorHandler({ statusCode: 401, message: err.message }, req, res, () => { });
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
};


// Update an existing user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const { email, username, password } = req.body;

        if (!id) {
            throw new Error('Missing user ID');
        }

        // Find the existing user
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }

        // Construct the update object based on the fields passed in the request body
        const updateData: any = {};

        if (email) {
            updateData.email = email;
        }

        if (username) {
            updateData.username = username;
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        // Update the user with the constructed update object
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        sendResponse(res, 200, `User ${id} updated successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};


// Delete an existing user
export const removeUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (!id) {
            throw new Error('Missing user ID');
        }
        await prisma.user.delete({
            where: { id: userId }
        });
        sendResponse(res, 200, `User ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Retrieve all users from the database
        const allUsers = await prisma.user.findMany();

        // Return the list of users in the response
        sendResponse(res, 200, 'List of all users', allUsers);
    } catch (err: any) {
        // Handle errors
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.params.username
            }
        });

        if (!user) {
            // If user is not found, send a 404 Not Found response
            throw new Error('User not found');
        }

        // If user is found, send a success response with the user details
        sendResponse(res, 200, 'User found', user);
    } catch (err: any) {
        // Handle errors
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => { });
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
};
