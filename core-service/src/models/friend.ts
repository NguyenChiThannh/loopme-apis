import { IUser } from './user';
import mongoose, { Schema, Document, Types } from 'mongoose';
interface IFriend extends Document {
    _id: Types.ObjectId;
    senderId: Types.ObjectId | IUser;
    receiverId: Types.ObjectId | IUser;
    status: 'pending' | 'accepted'
    sentAt: Date;
    acceptedAt?: Date;
}

const FriendSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    },
    sentAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date }
});

const FriendModel = mongoose.model<IFriend>('Friend', FriendSchema)

export default FriendModel
