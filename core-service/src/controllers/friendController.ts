import { friendService } from "../services/friendSerive"
import { AuthenticatedRequest } from "../types"
import { ResponseMessages } from "../utils/messages"
import { successResponse } from "../utils/responses"
import { NextFunction, Response } from "express"

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
        const friends = await friendService.getAllFriend({ userId, page, size })
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_FRIEND_SUCCESS,
            status: 200,
            data: {
                friends,
                total: friends.length
            }
        })
        return
    } catch (error) {
        next(error)
    }
}
const getAllInvitationsFriend = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const invitaions = await friendService.getAllInvitationsFriend(userId)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_INVITATIONS_FRIEND_SUCCESS,
            status: 200,
            data: {
                invitaions,
                total: invitaions.length
            }
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