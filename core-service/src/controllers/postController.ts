import { PaginatedResponse } from "@/dtos/PaginatedResponse"
import { postService } from "../services/postService"
import { AuthenticatedRequest } from "../types"
import { ResponseMessages } from "../utils/messages"
import { successResponse } from "../utils/responses"
import { NextFunction, Request, Response } from "express"

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const createdPost = await postService.create({
            ...req.body,
            user: req.user._id,
        })
        successResponse({
            message: ResponseMessages.POST.CREATE_POST_SUCCESS,
            res,
            status: 201,
            data: createdPost,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const post = await postService.getById(req.params.id, req.user._id)
        successResponse({
            message: ResponseMessages.POST.GET_POST_SUCCESS,
            res,
            status: 201,
            data: post
        })
    } catch (error) {
        next(error)
    }
}

const getPosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId : string = req.user._id
        const page : number = Number(req.query.page) || 1
        const size : number = Number(req.query.size) || 5
        const data: PaginatedResponse = await postService.getPosts({ userId, page, size })
        successResponse({
            message: ResponseMessages.POST.GET_POST_SUCCESS,
            res,
            status: 201,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

const getPostsByGroupId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const groupId : string = req.params.groupId
        const userId : string = req.user._id
        const page : number = Number(req.query.page) || 1
        const size : number = Number(req.query.size) || 5
        const data: PaginatedResponse = await postService.getPostsByGroupId({ groupId, userId, page, size })

        successResponse({
            message: ResponseMessages.POST.GET_POST_SUCCESS,
            res,
            status: 201,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

const upvote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId: string = req.params.id
        const userId: string = req.user._id
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
        const postId: string = req.params.id
        const userId: string = req.user._id
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
        const postId: string = req.params.id
        const userId: string = req.user._id
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

const addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await postService.addComment({
            postId: req.params.id,
            userId: req.user._id,
            content: req.body.content,
        })
        successResponse({
            message: ResponseMessages.POST.ADD_COMMENT_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await postService.deleteComment(req.params.id, req.query.commentId as string)
        successResponse({
            message: ResponseMessages.POST.DELETE_COMMENT_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}


export const postController = {
    create,
    getById,
    upvote,
    downvote,
    removevote,
    getPosts,
    getPostsByGroupId,
    addComment,
    deleteComment,
}