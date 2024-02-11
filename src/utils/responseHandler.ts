import { Response } from 'express';

interface ApiResponse {
    success: boolean;
    status: number;
    message: string;
    data?: any;
}

const sendResponse = (res: Response, statusCode: number, message: string, data?: any): void => {
    const responseData: ApiResponse = {
        success: true,
        status: statusCode,
        message: message
    };

    if (data !== undefined) {
        responseData.data = data;
    }

    res.status(statusCode).json(responseData);
}

export default sendResponse;
