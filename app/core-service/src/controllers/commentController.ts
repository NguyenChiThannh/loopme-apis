import { commentService } from "@/services/commentService"
import { NextFunction, Response } from "express"
// Common
import { AuthenticatedRequest } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const postId = req.params.postId
        const content = req.body.content
        const data = await commentService.create({ userId, postId, content })
        successResponse({
            message: ResponseMessages.COMMENT_POST.ADD_COMMENT_POST_SUCCESS,
            res,
            status: 200,
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const commentId = req.params.id
        await commentService.deleteComment(commentId, userId)
        successResponse({
            message: ResponseMessages.COMMENT_POST.DELETE_COMMENT_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const commentId = req.params.id
        const content = req.body.content
        const data = await commentService.update({ userId, commentId, content })
        successResponse({
            message: ResponseMessages.COMMENT_POST.UPDATE_COMMENT_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const commentController = {
    create,
    deleteComment,
    update,
}
