import { userService } from "@/services/userService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const searchUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const name = req.query.q as string
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data = await userService.searchUser({ userId, name, page, size, sort })
        successResponse({
            message: ResponseMessages.USER.SEARCH_USER_SUCCESS,
            res,
            status: 200,
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const userId: string = req.user._id
        const user = await userService.updateUser(data, userId)
        successResponse({
            message: ResponseMessages.USER.SEARCH_USER_SUCCESS,
            res,
            status: 200,
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user._id
        const user = await userService.getUser(userId)
        successResponse({
            message: ResponseMessages.USER.SEARCH_USER_SUCCESS,
            res,
            status: 200,
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    searchUser,
    updateUser,
    getUser,
}