import mongoose, { Schema, Document, Types } from 'mongoose';

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

export default VoteModel;
