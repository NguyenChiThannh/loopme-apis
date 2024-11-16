import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChannel extends Document {
    name: string;
    isRead: boolean;
    participants: Types.ObjectId[];
    createdAt: Date;
    readAt: Date;
    updatedAt: Date;
}

const ChannelSchema: Schema = new Schema({
    name: {
        type: String,
        default: '',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    readAt: {
        type: Date,
    },
}, { timestamps: true });

const ChannelModel = mongoose.model<IChannel>('Channel', ChannelSchema);

export default ChannelModel;