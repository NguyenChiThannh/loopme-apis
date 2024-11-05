import MessageModel from "@/models/message"
import mongoose from "mongoose"

const getAllMessage = async (myId: string, friendId: string) => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        const message = await MessageModel.find({
            $or: [
                { sender: myObjectId, receiver: friendObjectId },
                { sender: friendObjectId, receiver: myObjectId },
            ]
        }).populate('user', '_id displayName avatar')
        return message
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