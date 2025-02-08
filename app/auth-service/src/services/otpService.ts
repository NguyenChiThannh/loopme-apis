import { sendMail } from "@loopme/common";
import { CustomError } from "@loopme/common";
import { generateOTP } from "@loopme/common";
import { ResponseMessages } from "@loopme/common";
import { GMAIL_TYPE } from "@loopme/common";
import { OtpModel } from "@loopme/common";

const createOtp = async (email: string): Promise<number> => {
    try {
        let otp;
        let exists: boolean = true;

        while (exists) {
            otp = generateOTP()
            const existingOtp = await OtpModel.findOne({ otp });
            exists = !!existingOtp;
        }

        const newOtp = new OtpModel({
            email,
            otp,
        });
        await newOtp.save()
        sendMail(GMAIL_TYPE.COMFIRM_OTP, otp, email)
        return otp
    } catch (error) {
        throw error
    }
}

const verifyOtp = async (otp: number) => {
    try {
        const otpRecord = await OtpModel.findOne({ otp: otp })

        const currentTime = new Date();

        if (!otpRecord || otpRecord.isUsed || (otpRecord.expiredAt < currentTime)) {
            throw new CustomError(409, ResponseMessages.OTP.VERIFY_OTP_FAIL)
        }

        otpRecord.isUsed = true;
        await otpRecord.save();
        return otpRecord.email

    } catch (error) {
        throw error
    }
}

export const otpService = {
    createOtp,
    verifyOtp,
}