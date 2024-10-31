import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    ownerId: Types.ObjectId;
    members: Array<{
        userId: Types.ObjectId;
        joinAt: Date;
    }>;
    pendingInvitations: Array<{
        userId: Types.ObjectId;
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
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            _id: false,
            userId: {
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
            userId: {
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
        default: true,
    },
}, { timestamps: true });

const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);

export default GroupModel;
