import { postService } from "@/services/postService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Request, Response } from "express"

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const createdPost = await postService.create({
            ...req.body,
            userId: req.user._id,
        })
        successResponse({
            message: ResponseMessages.POST.CREATE_POST_SUCCESS,
            res,
            status: 201,
            data: {
                ...createdPost,
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

const upvote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        await postService.upvote(postId, userId)
        successResponse({
            message: ResponseMessages.POST.UPVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const downvote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        await postService.downvote(postId, userId)
        successResponse({
            message: ResponseMessages.POST.DOWNVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}


const removevote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        await postService.removevote(postId, userId)
        successResponse({
            message: ResponseMessages.POST.REMOVEVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const postController = {
    create,
    upvote,
    downvote,
    removevote
}