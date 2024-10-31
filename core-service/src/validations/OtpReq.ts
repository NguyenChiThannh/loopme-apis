import { z } from "zod";

export const OtpReqSchema = z.object({
    otp: z.string().min(6, { message: "OTP phải có 6 ký tự" }).max(6, { message: "OTP phải có 6 ký tự" }),
    email: z.string().email({ message: "Email không đúng định dạng" }),
})

export type OtpReq = z.infer<typeof OtpReqSchema>;
