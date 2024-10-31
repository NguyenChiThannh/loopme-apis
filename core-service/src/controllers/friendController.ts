import { friendService } from "../services/friendSerive"
import { AuthenticatedRequest } from "../types"
import { ResponseMessages } from "../utils/messages"
import { successResponse } from "../utils/responses"
import { NextFunction, Response } from "express"

const addPendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId1 = req.user._id
        const userId2 = req.params.userId
        await friendService.addPendingInvitations(userId1, userId2)
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
        const userId1 = req.user._id
        const userId2 = req.params.userId
        await friendService.removePendingInvitations(userId1, userId2)
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
        const userId1 = req.user._id
        const userId2 = req.params.userId
        await friendService.acceptInvitations(userId1, userId2)
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
        const userId1 = req.user._id
        const userId2 = req.params.userId
        await friendService.removeFriend(userId1, userId2)
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
        const userId1 = req.user._id
        await friendService.getAllFriend(userId1)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_FRIEND_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}
const getAllInvitationsFriend = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId1 = req.user._id
        await friendService.getAllInvitationsFriend(userId1)
        successResponse({
            res,
            message: ResponseMessages.FRIEND.GET_ALL_INVITATIONS_FRIEND_SUCCESS,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}
const suggestMutualFriends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        successResponse({
            res,
            message: ResponseMessages.OK,
            status: 200,
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