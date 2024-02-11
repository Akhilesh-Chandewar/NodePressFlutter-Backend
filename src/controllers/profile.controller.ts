import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responseHandler';
import errorHandler from '../utils/errorHandler';

const prisma = new PrismaClient();

// Add or update profile image
export const addOrUpdateProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const { username } = req.user;
        const { path } = req.file;

        const updatedProfile = await prisma.profile.update({
            where: { username },
            data: { img: path },
        });
        sendResponse(res, 200, 'Profile image added/updated successfully', { data: updatedProfile });
    } catch (err: any) {
        errorHandler({ statusCode: 500, message: err.message }, req, res, () => {});
    }
};

// Add profile
export const addProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.user;
        const { name, profession, DOB, titleline, about } = req.body;

        const profile = await prisma.profile.create({
            data: {
                username,
                name,
                profession,
                DOB,
                titleline,
                about,
            },
        });

        sendResponse(res, 200, 'Profile created successfully', { data: profile });
    } catch (err: any) {
        errorHandler({ statusCode: 500, message: err.message }, req, res, () => {});
    }
};

// Check Profile data
export const checkProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.user;

        const profile = await prisma.profile.findUnique({
            where: { username },
        });

        if (!profile) {
            return res.json({ status: false, username });
        } else {
            return res.json({ status: true, username });
        }
    } catch (err: any) {
        errorHandler({ statusCode: 500, message: err.message }, req, res, () => {});
    }
};

// Get Profile data
export const getProfileData = async (req: Request, res: Response) => {
    try {
        const { username } = req.user;

        const profile = await prisma.profile.findUnique({
            where: { username },
        });

        return res.json({ data: profile || [] });
    } catch (err: any) {
        errorHandler({ statusCode: 500, message: err.message }, req, res, () => {});
    }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.user;
        const { name, profession, DOB, titleline, about } = req.body;

        const updatedProfile = await prisma.profile.update({
            where: { username },
            data: {
                name: name || undefined,
                profession: profession || undefined,
                DOB: DOB || undefined,
                titleline: titleline || undefined,
                about: about || undefined,
            },
        });

        sendResponse(res, 200, 'Profile updated successfully', { data: updatedProfile });
    } catch (err: any) {
        errorHandler({ statusCode: 500, message: err.message }, req, res, () => {});
    }
};
