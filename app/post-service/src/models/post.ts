import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
    group?: Types.ObjectId;
    content: string;
    user: Types.ObjectId;
    images: string[];
    privacy: 'public' | 'private' | 'friends';
    createdAt: Date;
    updatedAt: Date;
}

export type PostUpdateData = Pick<IPost, 'privacy' | 'images' | 'content'>;

const PostSchema: Schema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        default: null,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    images: {
        type: [String],
        default: [],
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public',
    },
}, { timestamps: true });

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;

export const filterData = (data: Partial<PostUpdateData>, keys: (keyof PostUpdateData)[]): Partial<PostUpdateData> => {
    const filteredData: Partial<PostUpdateData> = {};

    keys.forEach((key) => {
        const value = data[key];

        // Kiểm tra cho từng thuộc tính
        if (key === "privacy" && (value === "public" || value === "private" || value === "friends")) {
            filteredData[key] = value;
        } else if (key === "content" && typeof value === "string") {
            filteredData[key] = value;
        } else if (key === "images" && Array.isArray(value)) {
            filteredData[key] = value;
        }
    });

    return filteredData;
};


export interface IGroup extends Document {
    name: string;
    owner: Types.ObjectId;
    members: Array<{
        user: Types.ObjectId;
        joinAt: Date;
    }>;
    pendingInvitations: Array<{
        user: Types.ObjectId;
        joinAt: Date;
    }>;
    background_cover?: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            _id: false,
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            joinAt: {
                type: Date,
                required: true,
                default: Date.now,
            },
        },
    ],
    pendingInvitations: [
        {
            _id: false,
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            joinAt: {
                type: Date,
                required: true,
                default: Date.now,
            },
        },
    ],
    background_cover: {
        type: String,
        default: '',
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);

export { GroupModel };

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

interface IFriend extends Document {
    _id: Types.ObjectId;
    sender: Types.ObjectId | IUser;
    receiver: Types.ObjectId | IUser;
    status: 'pending' | 'accepted'
    sentAt: Date;
    acceptedAt?: Date;
}

const FriendSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    },
    sentAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date }
});

const FriendModel = mongoose.model<IFriend>('Friend', FriendSchema)

export { FriendModel };

type VoteValue = 'UPVOTE' | 'DOWNVOTE';

export interface IVote extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    value: VoteValue;
}

const VoteSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        value: {
            type: String,
            required: true,
            enum: ['UPVOTE', 'DOWNVOTE'],
        },
    },
    { timestamps: true }
);

VoteSchema.index({ user: 1, post: 1 }, { unique: true });

const VoteModel = mongoose.model<IVote>('Vote', VoteSchema);

export { VoteModel };

export interface IComment extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export { CommentModel };


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

export { UserModel };

