import { memberService } from "@/services/memberService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
import { NextFunction, Response } from "express"

const getMembersInGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.query
        const data = await memberService.getMembersInGroup(groupId as string)
        successResponse({
            message: ResponseMessages.MEMBER_GROUP.GET_MEMBER_SUCCESS,
            res,
            status: 200,
            data,
        })
        return
    } catch (error) {
        next(error)
    }
}

const deleteMemberFromGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId, memberId } = req.query
        await memberService.deleteMemberFromGroup(groupId as string, memberId as string)
        successResponse({
            message: ResponseMessages.MEMBER_GROUP.DELETE_MEMBER_SUCCESS,
            res,
            status: 200,
        })
        return
    } catch (error) {
        next(error)
    }
}
export const memberController = {
    getMembersInGroup,
    deleteMemberFromGroup,
}