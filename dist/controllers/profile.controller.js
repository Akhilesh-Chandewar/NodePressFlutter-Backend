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
exports.updateProfile = exports.getProfileData = exports.checkProfile = exports.addProfile = exports.addOrUpdateProfileImage = void 0;
const client_1 = require("@prisma/client");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const prisma = new client_1.PrismaClient();
// Add or update profile image
const addOrUpdateProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const { username } = req.user;
        const { path } = req.file;
        const updatedProfile = yield prisma.profile.update({
            where: { username },
            data: { img: path },
        });
        (0, responseHandler_1.default)(res, 200, 'Profile image added/updated successfully', { data: updatedProfile });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 500, message: err.message }, req, res, () => { });
    }
});
exports.addOrUpdateProfileImage = addOrUpdateProfileImage;
// Add profile
const addProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const { name, profession, DOB, titleline, about } = req.body;
        const profile = yield prisma.profile.create({
            data: {
                username,
                name,
                profession,
                DOB,
                titleline,
                about,
            },
        });
        (0, responseHandler_1.default)(res, 200, 'Profile created successfully', { data: profile });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 500, message: err.message }, req, res, () => { });
    }
});
exports.addProfile = addProfile;
// Check Profile data
const checkProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const profile = yield prisma.profile.findUnique({
            where: { username },
        });
        if (!profile) {
            return res.json({ status: false, username });
        }
        else {
            return res.json({ status: true, username });
        }
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 500, message: err.message }, req, res, () => { });
    }
});
exports.checkProfile = checkProfile;
// Get Profile data
const getProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const profile = yield prisma.profile.findUnique({
            where: { username },
        });
        return res.json({ data: profile || [] });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 500, message: err.message }, req, res, () => { });
    }
});
exports.getProfileData = getProfileData;
// Update Profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.user;
        const { name, profession, DOB, titleline, about } = req.body;
        const updatedProfile = yield prisma.profile.update({
            where: { username },
            data: {
                name: name || undefined,
                profession: profession || undefined,
                DOB: DOB || undefined,
                titleline: titleline || undefined,
                about: about || undefined,
            },
        });
        (0, responseHandler_1.default)(res, 200, 'Profile updated successfully', { data: updatedProfile });
    }
    catch (err) {
        (0, errorHandler_1.default)({ statusCode: 500, message: err.message }, req, res, () => { });
    }
});
exports.updateProfile = updateProfile;
