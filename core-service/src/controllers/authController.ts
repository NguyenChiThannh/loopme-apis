import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService';
import { ChangePassworReq, LoginReq, RegisterReq } from '../validations/AuthReq';
import { successResponse } from '../utils/responses';
import { ResponseMessages } from '../utils/messages';
import { otpService } from '../services/otpService';
import { AuthenticatedRequest } from '../types';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const otp: number = await authService.registerUser(req.body as RegisterReq)
        successResponse({
            message: ResponseMessages.USER.REGISTER_SUCCESS,
            res,
            status: 201,
            data: {
                otp,
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body
        const email: string = await otpService.verifyOtp(Number(otp))
        const token = await authService.verifyAccount(email)

        res.cookie('access_token', token.accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        res.cookie('refresh_token', token.refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        successResponse({
            message: ResponseMessages.OTP.VERIFY_OTP_SUCCESS,
            res,
            status: 200
        })
        return
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.loginUser(req.body as LoginReq)
        if (data.isActive) {
            res.cookie('access_token', data.accessToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict',
            })
            res.cookie('refresh_token', data.refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict',
            })
        }

        const { password, provider, updatedAt, admin, accessToken, refreshToken, ...filterUser } = data

        successResponse({
            message: ResponseMessages.USER.LOGIN_SUCCESSFUL,
            res,
            status: 200,
            data: filterUser

        })
        return
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        await authService.changePassword(req.body as ChangePassworReq, userId)
        successResponse({
            message: ResponseMessages.USER.CHANGE_PASSWORD_SUCCESS,
            res,
            status: 200,

        })
        return
    } catch (error) {
        next(error)
    }
}


const requestRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string = req.cookies?.refresh_token
        const token = await authService.requestRefreshToken(refreshToken)

        res.cookie('access_token', token.newAccessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        res.cookie('refresh_token', token.newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        })
        successResponse({
            message: ResponseMessages.USER.REFRESH_TOKEN_SUCCESSFUL,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const logoutUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string = req.cookies?.refresh_token
        authService.logoutUser(refreshToken)
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        successResponse({
            message: ResponseMessages.USER.LOGOUT_SUCCESSFUL,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const otp: number = await otpService.createOtp(email)
        successResponse({
            message: ResponseMessages.USER.FORGOT_PASSWORD,
            res,
            status: 201,
            data: {
                otp,
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

const verifyForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body
        const email: string = await otpService.verifyOtp(Number(otp))
        const newPassword: string = await authService.verifyForgotPassword(email)
        successResponse({
            message: ResponseMessages.USER.VERIFY_FORGOT_PASSWORD,
            res,
            status: 201,
            data: {
                newPassword,
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

export const authController = {
    registerUser,
    verifyAccount,
    loginUser,
    requestRefreshToken,
    logoutUser,
    forgotPassword,
    verifyForgotPassword,
    changePassword,
}