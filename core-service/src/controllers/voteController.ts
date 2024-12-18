import { voteService } from "@/services/voteService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const upvote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const postId = req.params.postId
        const voteValue = 'UPVOTE'
        await voteService.vote({ userId, postId, voteValue })
        successResponse({
            message: ResponseMessages.VOTE_POST.UPVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const downvote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const postId = req.params.postId
        const voteValue = 'DOWNVOTE'
        await voteService.vote({ userId, postId, voteValue })
        successResponse({
            message: ResponseMessages.VOTE_POST.DOWNVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const removevote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const postId = req.params.postId
        await voteService.removevote(userId, postId)
        successResponse({
            message: ResponseMessages.VOTE_POST.REMOVEVOTE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const voteController = {
    upvote,
    downvote,
    removevote,
}