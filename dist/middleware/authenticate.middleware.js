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
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const prisma = new client_1.PrismaClient();
// Middleware to authenticate requests
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;
        const secrete_key = process.env.JWT_SECRETE;
        if (!token) {
            throw new Error('Authentication failed');
        }
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, `${secrete_key}`);
        // Check if the decoded token contains a userId
        if (!decodedToken.userId) {
            throw new Error('Invalid token');
        }
        // Check if the user exists in the database
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(decodedToken.userId) }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Attach the user object to the request for further processing
        req.user = user;
        // Call the next middleware or route handler
        next();
    }
    catch (err) {
        // Handle authentication errors
        (0, errorHandler_1.default)({ statusCode: 401, message: err.message }, req, res, next);
    }
});
exports.isAuthenticated = isAuthenticated;
