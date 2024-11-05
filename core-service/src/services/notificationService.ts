import NotificationModel from "@/models/notification"
import mongoose from "mongoose"

interface INotification {
    actor: string;
    recipient: string;
    type: 'dislike' | 'like' | 'comment' | 'request_to_join_group' | 'friend_request' | 'accept_join_group' | 'accept_friend';
    postId?: string;
    groupId?: string;
}

const create = async (data: INotification): Promise<void> => {
    try {
        const notification = new NotificationModel(data)
        await notification.save()
    } catch (error) {
        throw error
    }
}

const getAll = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const notifications = NotificationModel.find({
            recipient: userObjectId,
        }).populate('actor', 'avatar _id displayName')
        return notifications
    } catch (error) {
        throw error
    }
}

export const notificationService = {
    create,
    getAll,
}