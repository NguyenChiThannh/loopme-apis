import { CustomError } from "@/config/customError";
import { PaginatedResponse } from "@/dtos/PaginatedResponse"
import ChannelModel from "@/models/channel"
import MessageModel from "@/models/message"
import { ResponseMessages } from "@/utils/messages";
import mongoose from "mongoose"

const getAllMessage = async ({ myId, channelId, page, size, sort }: {
    myId: string,
    channelId: string | null,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        if (!channelId) throw new CustomError(400, ResponseMessages.BAD_REQUEST)
        const myObjectId = new mongoose.Types.ObjectId(myId);
        const channelObjectId = new mongoose.Types.ObjectId(channelId);

        const channel = await ChannelModel.findOne({
            _id: channelId,
            participants: { $in: [myObjectId] }
        }).populate({
            path: 'messages',
            options: {
                sort: { createdAt: sort },
                skip: (page - 1) * size,
                limit: size,
            },
            populate: [
                { path: 'sender', select: 'displayName avatar _id' },
                { path: 'receiver', select: 'displayName avatar _id' }
            ]
        });

        if (!channel) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }

        const totalMessages = await MessageModel.countDocuments({ _id: { $in: channel.messages.map(msg => msg._id) } });
        const totalPages = Math.ceil(totalMessages / size);

        return {
            data: channel.messages,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalMessages,
        };
    } catch (error) {
        throw error;
    }
};



const sendMessage = async ({ myId, friendId, message }: {
    myId: string,
    friendId: string,
    message: string
}) => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId);
        const friendObjectId = new mongoose.Types.ObjectId(friendId);

        let messageCreated = await MessageModel.create({
            sender: myObjectId,
            receiver: friendObjectId,
            message,
        })

        await ChannelModel.updateOne(
            {
                participants: { $all: [myObjectId, friendObjectId] },
            },
            {
                $push: { messages: messageCreated._id },
                $set: { isRead: false }
            }
        )

        messageCreated = await MessageModel.findById(messageCreated._id)
            .populate('sender', '_id displayName avatar')
            .populate('receiver', '_id displayName avatar');

        return messageCreated;
    } catch (error) {
        throw error;
    }
}


export const messageService = {
    getAllMessage,
    sendMessage,
}