
import { NextFunction, Response } from "express";
// Common
import { AuthenticatedRequest } from "@loopme/common";
import { ResponseMessages } from "@loopme/common";
import { CustomError } from "@loopme/common";
import { transport } from "@/transport";

const checkGroupMembership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const groupId: string = req.body.groupId || req.params.groupId
        if (!groupId) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        }
        const isMember: boolean = await transport.checkMemberGroup(groupId, req.user._id, req.cookies?.access_token)
        if (!isMember) {
            throw new CustomError(403, ResponseMessages.FORBIDDEN)
        }
        next();
    } catch (error) {
        next(error)
    }
};

export const groupMiddleware = {
    checkGroupMembership,
}


