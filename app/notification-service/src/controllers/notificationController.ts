import { notificationService } from "@/services/notificationService"
import { NextFunction, Response } from "express"
// Common
import { AuthenticatedRequest } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"

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

const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notificationId = req.params.id
        await notificationService.markAsRead(notificationId)
        successResponse({
            message: ResponseMessages.NOTIFICATIONS.MARK_AS_READ_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificationService.markAllAsRead(req.user._id)
        successResponse({
            message: ResponseMessages.NOTIFICATIONS.MARK_ALL_AS_READ_SUCCESS,
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
    markAsRead,
    markAllAsRead,
}