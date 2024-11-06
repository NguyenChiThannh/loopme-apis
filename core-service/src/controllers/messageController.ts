import { PaginatedResponse } from "@/dtos/PaginatedResponse"
import { messageService } from "@/services/messageService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await messageService.getAllMessage({ myId, friendId, page, size, sort })
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
        const content = req.body.content
        const messsage = await messageService.sendMessage({
            myId,
            friendId,
            content
        })
        successResponse({
            message: ResponseMessages.MESSAGE.SEND_MESSAGE_SUCCESS,
            res,
            status: 200,
            data: messsage
        })
    } catch (error) {
        next(error)
    }
}


export const messageController = {
    getAll,
    send
}
