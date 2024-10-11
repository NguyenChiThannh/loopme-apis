import { genarateToken } from '@/config/token';
import UserModel from '@/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface User {
    _id?: string;
    email?: string;
    password: string;
    displayName?: string;
    avatar?: string;
    admin?: boolean;
}


interface RegisterUserBody {
    email: string;
    password: string;
}

interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}

let refreshTokens: string[] = [];

// Đăng ký user
const registerUser = async (reqBody: RegisterUserBody) => {
    try {
        const user = await UserModel.findOne({
            email: reqBody?.email
        });
        if (user) return 'USER ALREADY EXISTS';

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(reqBody.password, salt);



        const newUser = new UserModel({
            email: reqBody.email,
            password: hashed,
            displayName: reqBody.email.match(/^(.*?)@/)![1],
            avatar: `https://ui-avatars.com/api/?name=${reqBody.email.match(/^(.*?)@/)![1]}&length=1`,
        });
        await newUser.save();
        return newUser
    } catch (error) {
        throw new Error(error as string);
    }
};

// Đăng nhập user
const loginUser = async (reqBody: RegisterUserBody) => {
    try {
        const user = await UserModel.findOne({
            email: reqBody?.email
        });
        if (!user) return 'NOT FOUND EMAIL';

        const comparePassword = await bcrypt.compare(reqBody.password, user.password);
        if (!comparePassword) return 'PASSWORD IS WRONG';

        if (user && comparePassword) {
            const accessToken = genarateToken.genarateAccessToken(user);
            const refreshToken = genarateToken.genarateRefreshToken(user);
            refreshTokens.push(refreshToken);
            return {
                ...user,
                accessToken,
                refreshToken,
            };
        }
    } catch (error) {
        throw new Error(error as string);
    }
};

// Yêu cầu token mới khi có refresh token
const requestRefreshToken = async (refreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string } | null> => {
    try {
        if (!refreshTokens.includes(refreshToken)) {
            return null;
        }

        return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                throw new Error(err.message);
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            const newAccessToken = genarateToken.genarateAccessToken(user as User);
            const newRefreshToken = genarateToken.genarateRefreshToken(user as User);
            refreshTokens.push(newRefreshToken);

            return {
                newAccessToken,
                newRefreshToken,
            };
        }) as Promise<{ newAccessToken: string; newRefreshToken: string }>;
    } catch (error) {
        throw new Error(error as string);
    }
};

// Đăng xuất user
const logoutUser = async (refreshToken: string): Promise<void> => {
    try {
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    } catch (error) {
        throw new Error(error as string);
    }
};

// Tìm user theo email
const findOneUserByEmail = async (email: string): Promise<User | null> => {
    try {
        return await UserModel.findOne({
            email,
        });;
    } catch (error) {
        throw new Error(error as string);
    }
};

// Tìm user theo ID
const findOneUserById = async (id: string): Promise<User | null> => {
    try {
        return await UserModel.findById(id);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const authService = {
    registerUser,
    loginUser,
    requestRefreshToken,
    logoutUser,
    findOneUserByEmail,
    findOneUserById,
};
