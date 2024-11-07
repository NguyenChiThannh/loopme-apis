import { z } from "zod";

export const RegisterReqSchema = z.object({
    displayName: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    email: z.string().email({ message: "Email không đúng định dạng" }),
    password: z.string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,}$/, { message: "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một chữ số." })
})
export const ChangePasswordReqSchema = z.object({
    currentPassword: z.string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,}$/, { message: "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một chữ số." }),
    confirmPassword: z.string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,}$/, { message: "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một chữ số." })
})

export type ChangePassworReq = z.infer<typeof ChangePasswordReqSchema>;


export const LoginReqSchema = RegisterReqSchema.omit({ displayName: true });

export type RegisterReq = z.infer<typeof RegisterReqSchema>;
export type LoginReq = z.infer<typeof LoginReqSchema>;

