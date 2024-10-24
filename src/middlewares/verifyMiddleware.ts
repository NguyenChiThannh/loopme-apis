import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { CustomError } from '@/config/customError';
import { ResponseMessages } from '@/utils/messages';
import { AuthenticatedRequest } from '@/types';


const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken
        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
                if (err) {
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

const verifyTokenAndAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        verifyToken(req, res, () => {
            if (req.user && (req.user.id === req.params.id || req.user.admin)) {
                next()
            } else {
                throw new CustomError(401, ResponseMessages.USER.UNAUTHORIZED)
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