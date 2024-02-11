import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responseHandler';
import errorHandler from '../utils/errorHandler';

const prisma = new PrismaClient();

export const addBlog = (async (req: Request, res: Response) => {
    try {
        const { title, body } = req.body;
        if ( !title || !body) {
            throw new Error('Missing required fields');
        }
        const createdBlogPost = await prisma.blogPost.create({
            data: {
                username: req.user.username,
                title: title,
                body: body
            }
        })
        sendResponse(res, 200, `Blog Added successfully`, { createdBlogPost });
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
})

export const getOwnBlogs = (async (req: Request, res: Response) => {
    try {
        const ownBlogPosts = await prisma.blogPost.findMany({
            where: {
                username: req.user.username,
            },
        });
        sendResponse(res, 200, ``, { ownBlogPosts });
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
})

export const getOtherBlogs = (async (req: Request, res: Response) => {
    try {
        const otherBlogPosts = await prisma.blogPost.findMany({
            where: {
                username: {
                    not: req.user.username,
                },
            },
        });
        sendResponse(res, 200, ``, { otherBlogPosts });
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
})

export const deleteBlog = (async (req: Request, res: Response) => {
    try {
        const deletedBlogPost = await prisma.blogPost.deleteMany({
            where: {
                AND: [
                    { username: req.user.username },
                    { id: parseInt(req.params.id) },
                ],
            },
        });
        if (deletedBlogPost.count > 0) {
            sendResponse(res, 200, `Blog deleted`);
        }
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
})

export const addCoverPhoto = (async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const updatedBlogPost = await prisma.blogPost.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                coverImage: req.file.path,
            },
        });
        sendResponse(res, 200, ``, { updatedBlogPost })
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
})



