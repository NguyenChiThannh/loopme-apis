import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { CustomError } from '../configs/customError';
import { ResponseMessages } from '../utils/messages';
import { AuthenticatedRequest } from '../types/index';
import env from '../configs/env';


const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.access_token
        if (accessToken) {
            jwt.verify(accessToken, env.JWT_ACCESS_TOKEN, (err: any, user: any) => {
                if (err) {
                    if (err.message.includes('jwt expired'))
                        throw new CustomError(401, ResponseMessages.USER.TOKEN_EXPIRED)
                    throw new CustomError(401, ResponseMessages.USER.UNAUTHORIZED)
                }
                req.user = user
                next()
            })
        } else {
            throw new CustomError(401, ResponseMessages.USER.UNAUTHORIZED)
        }
    } catch (error) {
        next(error)
    }

}

const verifyTokenAndAdminAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await verifyToken(req, res, () => {
            if (req.user && req.user.admin) {
                next()
            } else {
                throw new CustomError(403, ResponseMessages.FORBIDDEN)
            }
        })
    }
    catch (error) {
        next(error)
    }
}

export const verifyMiddleware = {
    verifyToken,
    verifyTokenAndAdminAuth,
}