import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    displayName: string;
    avatar?: string;
    password: string;
    admin?: boolean;
    provider?: string | null;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserUpdateData = Pick<IUser, 'displayName' | 'avatar'>;

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
    },
    avatar: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    admin: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;

export const filterData = (data: Partial<UserUpdateData>, keys: (keyof UserUpdateData)[]): Partial<UserUpdateData> => {
    const filteredData: Partial<UserUpdateData> = {};
    keys.forEach((key) => {
        if (key in data) {
            filteredData[key] = data[key];
        }
    });
    return filteredData;
};
