import { CustomError } from "@/config/customError";
import { groupService } from "@/services/groupService";
import { AuthenticatedRequest } from "@/types";
import { ResponseMessages } from "@/utils/messages";
import { NextFunction, Response } from "express";

const checkGroupMembership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.body.groupId) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }
        const isMember = await groupService.isMemberGroup(req.user._id, req.body.groupId);
        console.log('🚀 ~ checkGroupMembership ~ isMember:', isMember)
        if (!isMember) {
            throw new CustomError(404, ResponseMessages.USER.UNAUTHORIZED)
        }
        next();
    } catch (error) {
        next(error)
    }
};

const checkGroupOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.body.groupId) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }

        const isMember = await groupService.isOwnerGroup(req.user._id, req.body.groupId);
        if (!isMember) {
            throw new CustomError(404, ResponseMessages.USER.UNAUTHORIZED)
        }
        next();
    } catch (error) {
        next(error)
    }
};

export const groupMiddleware = {
    checkGroupMembership,
    checkGroupOwner,
}


