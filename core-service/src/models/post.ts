import mongoose, { Schema, Document, Types } from 'mongoose';

type VoteValue = 'UPVOTE' | 'DOWNVOTE';

interface IVote {
    user: Types.ObjectId;
    value: VoteValue;
}

interface IComment {
    user: Types.ObjectId;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPost extends Document {
    group?: Types.ObjectId;
    content: string;
    user: Types.ObjectId;
    images: string[];
    comments: IComment[]
    privacy: 'public' | 'private' | 'friends';
    votes: IVote[];
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
    votes: [{
        _id: false,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        value: {
            type: String,
            required: true,
            enum: ['UPVOTE', 'DOWNVOTE'],
        },
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }],
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