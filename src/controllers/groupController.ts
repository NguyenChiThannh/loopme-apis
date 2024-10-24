import { groupService } from "@/services/groupService"
import { AuthenticatedRequest } from "@/types"
import { ResponseMessages } from "@/utils/messages"
import { successResponse } from "@/utils/responses"
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

const getGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

}

export const groupController = {
    create,
    getGroup,
}