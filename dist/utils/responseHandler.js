"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, message, data) => {
    const responseData = {
        success: true,
        status: statusCode,
        message: message
    };
    if (data !== undefined) {
        responseData.data = data;
    }
    res.status(statusCode).json(responseData);
};
exports.default = sendResponse;
