import ChannelModel from "@/models/channel"
import MessageModel from "@/models/message"
import mongoose from "mongoose"
import { CustomError } from "@loopme/common"
import { PaginatedResponse } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"

const getAllMessage = async ({
    myId,
    channelId,
    page,
    size,
    sort,
}: {
    myId: string,
    channelId: string | null,
    page: number,
    size: number,
    sort: 1 | -1,
}): Promise<PaginatedResponse> => {
    try {
        if (!channelId) {
            throw new CustomError(400, ResponseMessages.BAD_REQUEST);
        }

        const myObjectId = new mongoose.Types.ObjectId(myId);
        const channelObjectId = new mongoose.Types.ObjectId(channelId);

        const channel = await ChannelModel.findOne({
            _id: channelObjectId,
            participants: myObjectId,
        });

        if (!channel) {
            throw new CustomError(403, ResponseMessages.FORBIDDEN);
        }

        const totalMessages = await MessageModel.countDocuments({ channel: channelObjectId });

        const totalPages = Math.ceil(totalMessages / size);

        const messages = await MessageModel.find({ channel: channelObjectId })
            .sort({ createdAt: sort })
            .skip((page - 1) * size)
            .limit(size)
            .populate('sender', '_id avatar displayName')
            .populate('receiver', '_id avatar displayName');

        return {
            data: messages,
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

        const channel = await ChannelModel.findOne(
            {
                participants: { $all: [myObjectId, friendObjectId] },
            },
        )
        if (!channel) throw new CustomError(404, ResponseMessages.NOT_FOUND)
        let messageCreated = await MessageModel.create({
            sender: myObjectId,
            receiver: friendObjectId,
            message,
            channel: channel._id
        })

        messageCreated = await MessageModel.findById(messageCreated._id)
            .populate('sender', '_id displayName avatar')
            .populate('receiver', '_id displayName avatar')
            .select('-channel')

        return messageCreated;
    } catch (error) {
        throw error;
    }
}

const update = async ({ myId, messageId, message }: {
    myId: string,
    messageId: string,
    message: string
}) => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId);
        const messageObjectId = new mongoose.Types.ObjectId(messageId);

        const existingMessage = await MessageModel.findById(messageObjectId);

        if (!existingMessage) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }

        if (existingMessage.sender.toString() !== myObjectId.toString()) {
            throw new CustomError(404, ResponseMessages.FORBIDDEN)
        }
        existingMessage.message = message;
        existingMessage.updatedAt = new Date();

        await existingMessage.save();

        return existingMessage;
    } catch (error) {
        throw error;
    }
};

const deleteComment = async (myId: string, messageId: string) => {
    try {

        const myObjectId = new mongoose.Types.ObjectId(myId);
        const messageObjectId = new mongoose.Types.ObjectId(messageId);

        const existingMessage = await MessageModel.findById(messageObjectId);

        if (!existingMessage) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }

        if (existingMessage.sender.toString() !== myObjectId.toString()) {
            throw new CustomError(404, ResponseMessages.FORBIDDEN)
        }
        await existingMessage.deleteOne();
        return
    } catch (error) {
        throw error
    }
}

export const messageService = {
    getAllMessage,
    sendMessage,
    update,
    deleteComment,
}