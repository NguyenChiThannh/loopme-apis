import { PaginatedResponse } from "@/dtos/PaginatedResponse"
import MessageModel from "@/models/message"
import mongoose from "mongoose"

const getAllMessage = async ({ myId, friendId, page, size, sort }: {
    myId: string,
    friendId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        const messages = await MessageModel.find({
            $or: [
                { sender: myObjectId, receiver: friendObjectId },
                { sender: friendObjectId, receiver: myObjectId }
            ]
        })
            .populate('sender', '_id displayName avatar')
            .populate('receiver', '_id displayName avatar')
            .sort({ createdAt: sort })
            .skip((page - 1) * size)
            .limit(size)

        const totalMessages = await MessageModel.countDocuments({
            $or: [
                { sender: myObjectId, receiver: friendObjectId },
                { sender: friendObjectId, receiver: myObjectId }
            ]
        });

        const totalPages = Math.ceil(totalMessages / size);

        return {
            data: messages,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalMessages,
        };
    } catch (error) {
        throw error
    }
}

const sendMessage = async ({ myId, friendId, content }: {
    myId: string,
    friendId: string,
    content: string
}) => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)

        const message = await MessageModel.create({
            sender: myObjectId,
            receiver: friendObjectId,
            message: content,
        })
        return message
    } catch (error) {
        throw error
    }
}


export const messageService = {
    getAllMessage,
    sendMessage
}