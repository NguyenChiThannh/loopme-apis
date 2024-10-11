import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'


interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

// Middleware xác thực token
const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken
    if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(401).json({ message: err.message })
            }
            req.user = user
            next()
        })
    } else {
        res.status(401).json({ message: 'You are not authenticated' })
    }
}

// Middleware xác thực quyền admin
const verifyTokenAndAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user && (req.user.id === req.params.id || req.user.admin)) {
            next()
        } else {
            return res.status(403).json({ message: 'You are not authenticated' })
        }
    })
}

// Middleware xác thực email bằng token
const confirmEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const verifyToken = req.body.token
    jwt.verify(verifyToken, process.env.VERIFY_ACCOUNT_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'The verification code has expired' })
        }
        req.user = user
        next()
    })
}


export const verifyMiddleware = {
    verifyToken,
    verifyTokenAndAdminAuth,
    //   confirmEmail,
}