import { IUser } from './user';
import mongoose, { Schema, Document, Types } from 'mongoose';
interface IFriend extends Document {
    _id: Types.ObjectId;
    sender: Types.ObjectId | IUser;
    receiver: Types.ObjectId | IUser;
    status: 'pending' | 'accepted'
    sentAt: Date;
    acceptedAt?: Date;
}

const FriendSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
