import mongoose, { Schema, Document, Types } from 'mongoose';

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

export default GroupModel;
