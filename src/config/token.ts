import jwt, { SignOptions } from 'jsonwebtoken'


const genarateAccessToken = (user: any): string => {
    return jwt.sign(
        {
            _id: user._id.toString(),
            admin: user.admin
        },
        process.env.JWT_ACCESS_TOKEN as string,
        { expiresIn: '1h' } as SignOptions
    )
}

const genarateRefreshToken = (user: any): string => {
    return jwt.sign(
        {
            _id: user._id.toString(),
            admin: user.admin
        },
        process.env.JWT_REFRESH_TOKEN as string,
        { expiresIn: '150d' } as SignOptions
    )
}

const encryptInfo = (user): string => {
    return jwt.sign(
        {
            email: user.email,
            password: user.password
        },
        process.env.VERIFY_ACCOUNT_TOKEN as string,
        { expiresIn: '600000' } as SignOptions
    )
}

const encryptInvitation = (userId: string, boardId: string): string => {
    return jwt.sign(
        {
            userId,
            boardId
        },
        process.env.VERIFY_ACCOUNT_TOKEN as string,
        { expiresIn: '600000' } as SignOptions
    )
}

export const genarateToken = {
    genarateAccessToken,
    genarateRefreshToken,
    encryptInfo,
    encryptInvitation,
}
