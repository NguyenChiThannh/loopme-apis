import { otpService } from '@/services/otpService'
import { ResponseMessages } from '@/utils/messages'
import { successResponse } from '@/utils/responses'
import { Request, Response, NextFunction } from 'express'

const refreshOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const otp = await otpService.createOtp(email)
        successResponse({
            message: ResponseMessages.OTP.REFRESH_OTP_SUCCESS,
            res,
            status: 200,
            data: {
                otp
            }
        })
    } catch (error) {

    }
}

export const otpController = {
    refreshOTP,
}