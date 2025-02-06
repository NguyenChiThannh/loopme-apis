import mongoose, { Schema, Document, Types } from 'mongoose';

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

export default CommentModel;
