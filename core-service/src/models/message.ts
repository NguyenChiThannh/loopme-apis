import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
    _id: string
    sender: Types.ObjectId
    receiver: Types.ObjectId
    message: string,
    createdAt: Date
    updatedAt: Date
}

// Create the schema for messages
const MessageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;


