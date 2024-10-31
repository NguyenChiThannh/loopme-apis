import mongoose, { Schema, Document, Types } from 'mongoose';

type VoteValue = 'UPVOTE' | 'DOWNVOTE';

export interface IVote {
    userId: Types.ObjectId;
    value: VoteValue; // Nếu bạn muốn giới hạn giá trị
}

export interface IPost extends Document {
    groupId?: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    images: string[];
    privacy: 'public' | 'private' | 'friends';
    votes: IVote[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        default: null,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    userId: {
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
        userId: {
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
}, { timestamps: true });

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
