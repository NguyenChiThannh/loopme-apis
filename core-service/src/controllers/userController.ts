import { userService } from "@/services/userService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const searchUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const name = req.query.q as string
        const userId: string = req.user._id
        const user = await userService.searchUser(name, userId)
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