import { CustomError } from '../configs/customError';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        const responseError = {
            statusCode: err.statusCode,
            message: err.message,
            stack: err.stack,
        };

        if (process.env.BUILD_MODE !== 'dev') delete responseError.stack;

        res.status(err.statusCode).json(responseError);
        return
    }

    const responseError = {
        statusCode: err.statusCode || 500, // Nếu không có statusCode thì mặc định là 500
        message: err.message || 'Internal Server Error',
        stack: err.stack
    };

    if (process.env.BUILD_MODE !== 'dev') delete responseError.stack;

    res.status(responseError.statusCode).json(responseError);
    return
};
