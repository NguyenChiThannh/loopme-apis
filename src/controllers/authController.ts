import { Request, Response, NextFunction } from 'express'
// import { sendMail } from '~/mail/sendMail'
// import { GMAIL_TYPE } from '~/mail/gmailType'
import { genarateToken } from '@/config/token'
import { authService } from '@/services/authService';

// Định nghĩa interface cho User (nếu cần)
interface User {
    id: string;
    email: string;
    password?: string;
    loginType?: string;
    createdAt?: Date;
    admin?: boolean;
    accessToken?: string;
    refreshToken?: string;
}

const registerUser = async (req: Request, res: Response, next: NextFunction)

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await authService.loginUser(req.body)
        if (token == 'NOT FOUND EMAIL' || token == 'PASSWORD IS WRONG') {
            res.status(400).json({ message: token })
            return
        }
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,

            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })

        const { password, provider, createdAt, admin, accessToken, refreshToken, ...filterUser } = token

        if (filterUser) {
            res.status(200).json(filterUser)
            return
        } else {
            res.status(401).json({ message: token })
            return
        }
    } catch (error) {
        next(error)
    }
}

const requestRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        const token = await authService.requestRefreshToken(refreshToken)
        if (token) {
            res.cookie('accessToken', token.newAccessToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict',
            })
            res.cookie('refreshToken', token.newRefreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict',
            })
            res.status(200).json({ message: 'Request token successful' })
        } else {
            res.status(401).json({ message: 'Token not valid' })
        }
    } catch (error) {
        next(error)
    }
}

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        authService.logoutUser(refreshToken)
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')

        res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        next(error)
    }
}


export const authController = {
    loginUser,
    requestRefreshToken,
    logoutUser,
}
