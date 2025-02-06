import { friendService } from "../services/friendSerive"
import { NextFunction, Response } from "express"
// Common
import { AuthenticatedRequest } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { successResponse } from "@loopme/common"
import { PaginatedResponse } from "@loopme/common"

const addPendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        await friendService.addPendingInvitations(myId, friendId)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.ADD_PENDING_INVITATIONS_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const removePendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        await friendService.removePendingInvitations(myId, friendId)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.REMOVE_PENDING_INVITATIONS_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const acceptInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        await friendService.acceptInvitations(myId, friendId)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.ACCEPT_PENDING_INVITATIONS_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const removeFriend = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id
        const friendId = req.params.userId
        await friendService.removeFriend(myId, friendId)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.REMOVE_FRIEND_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllFriend = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await friendService.getAllFriend({ userId, page, size, sort })
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_FRIEND_SUCCESS,
            status: 200,
            data,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllInvitationsFriend = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const page = Number(req.query.page) || 1
        const size = Number(req.query.size) || 5
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : 1
        const data: PaginatedResponse = await friendService.getAllInvitationsFriend({ userId, page, size, sort })
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_INVITATIONS_FRIEND_SUCCESS,
            status: 200,
            data,
        })

        return
    } catch (error) {
        next(error)
    }
}

const suggestMutualFriends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const mutualFriends = await friendService.suggestMutualFriends(req.user._id)
        successResponse({
            res,
            message: ResponseMessages.OK,
            status: 200,
            data: mutualFriends,
        })
        return
    } catch (error) {
        next(error)
    }
}

export const friendController = {
    addPendingInvitations,
    removePendingInvitations,
    acceptInvitations,
    removeFriend,
    getAllFriend,
    getAllInvitationsFriend,
    suggestMutualFriends,
}