"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = exports.removeUser = exports.updateUser = exports.login = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const prisma = new client_1.PrismaClient();
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            throw new Error('Missing required fields');
        }
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });
        (0, responseHandler_1.default)(res, 200, `${username} registered successfully`);
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.registerUser = registerUser;
// Login user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const secrete_key = process.env.JWT_SECRETE;
        // Check if username and password are provided
        if (!username || !password) {
            throw new Error('Missing username or password');
        }
        // Find the user by username
        const user = yield prisma.user.findUnique({
            where: { username }
        });
        // Check if the user exists
        if (!user) {
            throw new Error('Invalid username or password');
        }
        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        // If passwords don't match, throw an error
        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, `${secrete_key}`, { expiresIn: '24h' });
        // Send the token in the response
        (0, responseHandler_1.default)(res, 200, 'Login successful', { token });
    }
    catch (err) {
        // Handle errors
        (0, errorHandler_1.default)({ statusCode: 401, message: err.message }, req, res, () => { });
    }
    finally {
        // Disconnect Prisma client
        yield prisma.$disconnect();
    }
});
exports.login = login;
// Update an existing user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const { email, username, password } = req.body;
        if (!id) {
            throw new Error('Missing user ID');
        }
        // Find the existing user
        const existingUser = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }
        // Construct the update object based on the fields passed in the request body
        const updateData = {};
        if (email) {
            updateData.email = email;
        }
        if (username) {
            updateData.username = username;
        }
        if (password) {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            updateData.password = hashedPassword;
        }
        // Update the user with the constructed update object
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: updateData
        });
        (0, responseHandler_1.default)(res, 200, `User ${id} updated successfully`);
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateUser = updateUser;
// Delete an existing user
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (!id) {
            throw new Error('Missing user ID');
        }
        yield prisma.user.delete({
            where: { id: userId }
        });
        (0, responseHandler_1.default)(res, 200, `User ${id} deleted successfully`);
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.removeUser = removeUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all users from the database
        const allUsers = yield prisma.user.findMany();
        // Return the list of users in the response
        (0, responseHandler_1.default)(res, 200, 'List of all users', allUsers);
    }
    catch (err) {
        // Handle errors
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        // Disconnect Prisma client
        yield prisma.$disconnect();
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username: req.params.username
            }
        });
        if (!user) {
            // If user is not found, send a 404 Not Found response
            throw new Error('User not found');
        }
        // If user is found, send a success response with the user details
        (0, responseHandler_1.default)(res, 200, 'User found', user);
    }
    catch (err) {
        // Handle errors
        (0, errorHandler_1.default)({ statusCode: 404, message: err.message }, req, res, () => { });
    }
    finally {
        // Disconnect Prisma client
        yield prisma.$disconnect();
    }
});
exports.getUser = getUser;
