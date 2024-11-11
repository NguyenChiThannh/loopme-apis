import NotificationModel from "@/models/notification"
import RabbitMQService from "@/utils/amqp";
import mongoose from "mongoose"

interface INotification {
    actor: string;
    receiver: string;
    type: 'dislike' | 'like' | 'comment' | 'request_to_join_group' | 'friend_request' | 'accept_join_group' | 'accept_friend';
    postId?: string;
    groupId?: string;
}

const create = async (data: INotification): Promise<void> => {
    try {
        const notification = new NotificationModel(data)
        await notification.save()

        // Pub message to the realtime service 
        await notification.populate('actor', 'displayName avatar _id')

        // const realtime = new RabbitMQService(process.env.ExchangeName_Realtime_Service)

        // realtime.publishMessage("Notifications", notification)

        // 1111

        return
    } catch (error) {
        throw error
    }
}

const getAll = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const notifications = NotificationModel.find({
            receiver: userObjectId,
        }).populate('actor', 'avatar _id displayName')
        return notifications
    } catch (error) {
        throw error
    }
}

const markAsRead = async (notificationId): Promise<void> => {
    try {
        const notificationObjectId = new mongoose.Types.ObjectId(notificationId)
        await NotificationModel.updateOne(
            {
                _id: notificationObjectId,
            },
            {
                $set: { isRead: true }
            }
        )
        return
    } catch (error) {
        throw error
    }
}

const markAllAsRead = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        await NotificationModel.updateMany(
            { receiver: userObjectId, isRead: false },
            { $set: { isRead: true } }
        );

        const updatedNotifications = await NotificationModel.find({
            receiver: userObjectId,
            isRead: true
        });

        return updatedNotifications;
    } catch (error) {
        throw error
    }
}

export const notificationService = {
    create,
    getAll,
    markAsRead,
    markAllAsRead
}