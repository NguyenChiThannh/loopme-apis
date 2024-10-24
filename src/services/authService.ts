import { CustomError } from '@/config/customError';
import { genarateToken } from '@/config/token';
import UserModel, { IUser } from '@/models/user';
import { RegisterReq } from '@/validations/AuthReq';
import { otpService } from '@/services/otpService';
import { generateRandomString } from '@/utils/algorithms';
import { ResponseMessages } from '@/utils/messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


let refreshTokens: string[] = [];

const registerUser = async (data: RegisterReq): Promise<number> => {
    try {
        const user = await UserModel.findOne({
            email: data?.email
        });

        if (user) throw new CustomError(409, ResponseMessages.USER.USER_ALREADY_EXISTS);

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(data.password, salt);

        const newUser = new UserModel({
            email: data.email,
            password: hashed,
            displayName: data.displayName,
            avatar: `https://ui-avatars.com/api/?name=${data.email.match(/^(.*?)@/)![1]}&length=1`,
        });
        await newUser.save();

        const otp = otpService.createOtp(newUser.email)

        return otp
    } catch (error) {
        throw error
    }
};

const verifyAccount = async (email: String): Promise<{ accessToken: string; refreshToken: string }> => {
    try {

        const user = await UserModel.findOne({
            email
        })
        if (user) {
            user.isActive = true;
            await user.save();
        }
        const accessToken = genarateToken.genarateAccessToken(user)
        const refreshToken = genarateToken.genarateRefreshToken(user)
        return { accessToken, refreshToken }
    } catch (error) {
        throw error
    }
}

const loginUser = async (reqBody) => {
    try {
        const user = await UserModel.findOne({
            email: reqBody?.email
        }).lean();
        if (!user) throw new CustomError(404, ResponseMessages.USER.LOGIN_FAIL);

        const comparePassword = await bcrypt.compare(reqBody.password, user.password);
        if (!comparePassword) throw new CustomError(404, ResponseMessages.USER.LOGIN_FAIL);

        const accessToken = genarateToken.genarateAccessToken(user);
        const refreshToken = genarateToken.genarateRefreshToken(user);
        refreshTokens.push(refreshToken);
        return {
            ...user,
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        throw error
    }
};

const requestRefreshToken = async (refreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string }> => {
    try {
        if (!refreshTokens.includes(refreshToken)) {
            throw new CustomError(401, ResponseMessages.USER.UNAUTHORIZED)
        }

        return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                throw new CustomError(401, ResponseMessages.USER.UNAUTHORIZED)
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            const newAccessToken = genarateToken.genarateAccessToken(user as IUser);
            const newRefreshToken = genarateToken.genarateRefreshToken(user as IUser);
            refreshTokens.push(newRefreshToken);

            return {
                newAccessToken,
                newRefreshToken,
            };
        });
    } catch (error) {
        throw error
    }
};

const logoutUser = async (refreshToken: string): Promise<void> => {
    try {
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    } catch (error) {
        throw new Error(error as string);
    }
};

const verifyForgotPassword = async (email: string): Promise<String> => {
    try {
        const newPassword = generateRandomString(9)
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await UserModel.findOneAndUpdate(
            { email },
            { "$set": { password: hashed } }
        )
        return newPassword
    } catch (error) {
        throw error
    }
}

const findOneUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
        return await UserModel.findOne({
            email,
        });;
    } catch (error) {
        throw new Error(error as string);
    }
};

const findOneUserById = async (id: string): Promise<IUser | null> => {
    try {
        return await UserModel.findById(id);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const authService = {
    registerUser,
    verifyAccount,
    loginUser,
    requestRefreshToken,
    logoutUser,
    verifyForgotPassword,
    findOneUserByEmail,
    findOneUserById,
};
