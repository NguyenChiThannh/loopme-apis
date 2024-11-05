import { messageService } from "@/services/messageService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        const messsages = await messageService.getAllMessage(myId, friendId)
        successResponse({
            message: ResponseMessages.MESSAGE.GET_MESSAGE_SUCCESS,
            res,
            status: 200,
            data: messsages,
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
