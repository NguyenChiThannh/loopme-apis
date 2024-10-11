import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript cho User
interface IUser extends Document {
    displayName: string;
    avatar?: string;
    password: string;
    admin?: boolean;
    provider?: string | null;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema cho User model với validation
const UserSchema: Schema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
