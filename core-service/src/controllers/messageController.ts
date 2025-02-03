import { messageService } from "@/services/messageService"
import { NextFunction, Response } from "express"
// Common
import { AuthenticatedRequest } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"
import { RabbitMQService } from '@loopme/common'
import { PaginatedResponse } from "@loopme/common"

const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const channelId = String(req.query.channelId) || null
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await messageService.getAllMessage({ myId, channelId, page, size, sort })
        successResponse({
            message: ResponseMessages.MESSAGE.GET_MESSAGE_SUCCESS,
            res,
            status: 200,
            data,
        })
    } catch (error) {
        next(error)
    }
}

const send = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        const message = req.body.message
        const messageCreated = await messageService.sendMessage({
            myId,
            friendId,
            message
        })

        // Pub message to the realtime service 

        const realtime = new RabbitMQService(process.env.ExchangeName_Realtime_Service)

        realtime.publishMessage("Message", messageCreated)
        // 1111

        successResponse({
            message: ResponseMessages.MESSAGE.SEND_MESSAGE_SUCCESS,
            res,
            status: 200,
            data: messageCreated,
        })
    } catch (error) {
        next(error)
    }
}


const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const messageId = req.params.id
        const myId = req.user._id
        const message = req.body.message
        const messageUpdated = await messageService.update({ myId, messageId, message })
        successResponse({
            message: ResponseMessages.MESSAGE.UPDATE_MESSAGE_SUCCESS,
            res,
            status: 200,
            data: messageUpdated
        })
    } catch (error) {
        next(error)
    }
}


const deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const messageId = req.params.id
        const myId = req.user._id
        await messageService.deleteComment(myId, messageId)
        successResponse({
            message: ResponseMessages.MESSAGE.UPDATE_MESSAGE_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const messageController = {
    getAll,
    send,
    update,
    deleteMessage,
}
