import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    actor: Types.ObjectId;
    receiver: Types.ObjectId;
    type: 'dislike' | 'like' | 'comment' | 'request_to_join_group' | 'friend_request' | 'accept_join_group' | 'accept_friend'
    postId?: Types.ObjectId;
    groupId?: Types.ObjectId;
    createdAt: Date;
    isRead: boolean;
}

const NotificationSchema = new Schema<INotification>({
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['dislike', 'like', 'comment', 'request_to_join_group', 'friend_request', 'accept_join_group', 'accept_friend'],
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
