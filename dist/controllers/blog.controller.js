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
exports.addCoverPhoto = exports.deleteBlog = exports.getOtherBlogs = exports.getOwnBlogs = exports.addBlog = void 0;
const client_1 = require("@prisma/client");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const prisma = new client_1.PrismaClient();
exports.addBlog = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            throw new Error('Missing required fields');
        }
        const createdBlogPost = yield prisma.blogPost.create({
            data: {
                username: req.user.username,
                title: title,
                body: body
            }
        });
        (0, responseHandler_1.default)(res, 200, `Blog Added successfully`, { createdBlogPost });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.getOwnBlogs = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownBlogPosts = yield prisma.blogPost.findMany({
            where: {
                username: req.user.username,
            },
        });
        (0, responseHandler_1.default)(res, 200, ``, { ownBlogPosts });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.getOtherBlogs = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otherBlogPosts = yield prisma.blogPost.findMany({
            where: {
                username: {
                    not: req.user.username,
                },
            },
        });
        (0, responseHandler_1.default)(res, 200, ``, { otherBlogPosts });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.deleteBlog = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedBlogPost = yield prisma.blogPost.deleteMany({
            where: {
                AND: [
                    { username: req.user.username },
                    { id: parseInt(req.params.id) },
                ],
            },
        });
        if (deletedBlogPost.count > 0) {
            (0, responseHandler_1.default)(res, 200, `Blog deleted`);
        }
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.addCoverPhoto = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const updatedBlogPost = yield prisma.blogPost.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                coverImage: req.file.path,
            },
        });
        (0, responseHandler_1.default)(res, 200, ``, { updatedBlogPost });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 400, message: err.message }, req, res, () => { });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
