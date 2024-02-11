import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: { statusCode: number; message: string; }, req:Request, res:Response, next:NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
}

export default errorHandler;