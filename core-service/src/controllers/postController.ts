import { postService } from "../services/postService"
import { NextFunction, Response } from "express"
// Common
import { AuthenticatedRequest } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"
import { PaginatedResponse } from "@loopme/common"

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

const updateById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await postService.updateById(req.params.id, req.user._id, req.body)
        successResponse({
            message: ResponseMessages.POST.UPDATE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const deleteById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await postService.deleteById(req.params.id, req.user._id)
        successResponse({
            message: ResponseMessages.POST.DELETE_POST_SUCCESS,
            res,
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

const getPosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user._id
        const page: number = Number(req.query.page) || 1
        const size: number = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await postService.getPosts({ userId, page, size, sort })
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
        const groupId: string = req.params.groupId
        const userId: string = req.user._id
        const page: number = Number(req.query.page) || 1
        const size: number = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await postService.getPostsByGroupId({ groupId, userId, page, size, sort })

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

const getPostsByUserId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.params.userId
        const myId: string = req.user._id
        const page: number = Number(req.query.page) || 1
        const size: number = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await postService.getPostsByUserId({ myId, userId, page, size, sort })

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

export const postController = {
    create,
    getById,
    deleteById,
    updateById,
    getPosts,
    getPostsByGroupId,
    getPostsByUserId,
}