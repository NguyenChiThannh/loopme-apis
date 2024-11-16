import { channelService } from "@/services/channelService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data = await channelService.getAll({ userId, page, size, sort })
        successResponse({
            message: ResponseMessages.CHANNEL.GET_ALL_CHANNEL_SUCCESS,
            res,
            status: 200,
            data,
        })
    } catch (error) {
        next(error)
    }
}

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const friendId = req.body.friendId
        const data = await channelService.create({ userId, friendId })
        successResponse({
            message: ResponseMessages.CHANNEL.CREATE_CHANNEL_SUCCESS,
            res,
            status: 200,
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getDetail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const channelId = req.params.id
        const data = await channelService.getDetail(myId, channelId)
        successResponse({
            res,
            message: ResponseMessages.CHANNEL.GET_CHANNEL_SUCCESS,
            status: 200,
            data,
        })
        return
    } catch (error) {
        next(error)
    }
}
export const channelController = {
    create,
    getAll,
    getDetail,
}
