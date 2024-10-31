import { groupService } from "../services/groupService"
import { AuthenticatedRequest } from "../types"
import { ResponseMessages } from "../utils/messages"
import { successResponse } from "../utils/responses"
import { Response, NextFunction } from "express"

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const createdGroup = await groupService.create({
            ...req.body,
            userId: req.user._id,
        })
        successResponse({
            message: ResponseMessages.GROUP.CREATE_GROUP_SUCCESS,
            res,
            status: 201,
            data: {
                ...createdGroup
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

const getGroupById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

}

const getPostsInGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

}

const addPendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user._id
        const { groupId } = req.params
        await groupService.addPendingInvitations(userId, groupId)
        successResponse({
            message: ResponseMessages.GROUP.ADD_PENDING_INVITATIONS_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const acceptPendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId, userId } = req.params
        await groupService.acceptPendingInvitations(userId, groupId)
        successResponse({
            message: ResponseMessages.GROUP.ACCEPT_PENDING_INVITATIONS_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const removePendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user._id
        const { groupId } = req.params
        await groupService.removePendingInvitations(userId, groupId)
        successResponse({
            message: ResponseMessages.GROUP.REMOVE_PENDING_INVITATIONS_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const addMemberToGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId, userId } = req.params
        await groupService.addMemberToGroup(userId, groupId)
        successResponse({
            message: ResponseMessages.GROUP.ADD_MEMBER_TO_GROUP_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const removeMemberFromGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId, userId } = req.params
        await groupService.removeMemberFromGroup(userId, groupId)
        successResponse({
            message: ResponseMessages.GROUP.REMOVE_MEMBER_FROM_GROUP_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllPendingInvitations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params
        await groupService.getAllPendingInvitations(groupId)
        successResponse({
            message: ResponseMessages.GROUP.GET_ALL_PENDING_INVITATIONS_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllMembers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params
        const members = await groupService.getAllMembers(groupId)
        successResponse({
            message: ResponseMessages.GROUP.GET_ALL_MEMBERS_GROUP_SUCCESS,
            res,
            status: 200,
            data: {
                members,
            }
        })
        return
    } catch (error) {
        next(error)
    }
}

export const groupController = {
    create,
    getGroupById,
    addPendingInvitations,
    acceptPendingInvitations,
    removePendingInvitations,
    addMemberToGroup,
    removeMemberFromGroup,
    getAllPendingInvitations,
    getAllMembers,
    getPostsInGroup,
}