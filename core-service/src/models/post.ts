import mongoose, { Schema, Document, Types } from 'mongoose';

type VoteValue = 'UPVOTE' | 'DOWNVOTE';

interface IVote {
    user: Types.ObjectId;
    value: VoteValue;
}

interface IComment {
    user: Types.ObjectId;
    value: string;
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
            enum: ['UPVOTE', 'DOWNVOTE'], // Giới hạn giá trị
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
    }],
}, { timestamps: true });

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
