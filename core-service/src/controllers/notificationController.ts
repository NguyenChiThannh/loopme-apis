import { notificationService } from "@/services/notificationService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificationService.getAll(req.user._id)
        successResponse({
            message: ResponseMessages.NOTIFICATIONS.GET_ALL_NOTIFICATIONS_SUCCESS,
            res,
            status: 200,
            data: notifications,
        })
        return
    } catch (error) {
        next(error)
    }
}

export const notificationController = {
    getAll,
}