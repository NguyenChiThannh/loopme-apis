import { otpService } from '../services/otpService'
import { Request, Response, NextFunction } from 'express'
// Common
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"

const refreshOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const otp: number = await otpService.createOtp(email)
        successResponse({
            message: ResponseMessages.OTP.REFRESH_OTP_SUCCESS,
            res,
            status: 200,
            data: {
                otp
            }
        })
    } catch (error) {
        next(error)
    }
}

export const otpController = {
    refreshOTP,
}