import { notificationService } from "@/services/notificationService"
import { CustomError } from "../config/customError"
import GroupModel from "../models/group"
import { ResponseMessages } from "../utils/messages"
import mongoose from "mongoose"

const create = async (data) => {
    try {
        const group = new GroupModel({
            ...data,
            owner: data.userId,
        })
        await group.save()
        return group.toObject()
    } catch (error) {
        throw error
    }
}

const getGroupById = async (groupId: string) => {
    try {
        const groupObjId = new mongoose.Types.ObjectId(groupId)
        const group = await GroupModel.findOne({
            _id: groupObjId
        }).populate('owner', 'displayName avatar _id').populate("members.user", 'displayName avatar _id')
        return group
    } catch (error) {

    }
}

const isMemberGroup = async (userId: string, groupId: string): Promise<boolean> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)

        const group = await GroupModel.aggregate([
            {
                $match: { _id: groupObjId }
            },
            {
                $project: {
                    isMember: {
                        $or: [
                            { $in: [userObjId, "$members.user"] },
                            { $eq: [userObjId, "$owner"] },
                        ]
                    },
                    _id: 0,

                }
            }
        ]);
        if (!group || group.length === 0) {
            return false;
        }

        return group[0].isMember;
    } catch (error) {
        throw error
    }
}

const isOwnerGroup = async (userId: string, groupId: string): Promise<boolean> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)

        const group = await GroupModel.findOne({
            _id: groupObjId,
            owner: userObjId,
        });

        return group !== null;
    } catch (error) {
        throw error;
    }
};

const addPendingInvitations = async (userId: string, groupId: string): Promise<void> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)

        const group = await GroupModel.findById(groupObjId).select('owner');

        if (!group) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "members.user": { $ne: userObjId },
                "pendingInvitations.user": { $ne: userObjId }
            },
            {
                $push: { pendingInvitations: { user: userObjId, joinAt: new Date() } }
            })

        await notificationService.create({
            actor: userId,
            recipient: group.owner.toString(),
            groupId: groupId,
            type: 'request_to_join_group',
        })
        return
    } catch (error) {
        throw error
    }
}

const acceptPendingInvitations = async (userId: string, groupId: string): Promise<void> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(`${userId}`)
        const groupObjId = new mongoose.Types.ObjectId(`${groupId}`)

        const group = await GroupModel.findById(groupObjId).select('owner');

        if (!group) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "pendingInvitations.user": { $eq: userObjId }
            },
            {
                $pull: { pendingInvitations: { user: userObjId } },
                $push: { members: { user: userObjId, joinAt: new Date() } }
            }
        )

        await notificationService.create({
            actor: group.owner.toString(),
            recipient: userId,
            groupId: groupId,
            type: 'accept_join_group',
        })

        return
    } catch (error) {
        throw error
    }
}

const removePendingInvitations = async (userId: string, groupId: string): Promise<void> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)
        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "pendingInvitations.user": { $eq: userObjId }
            },
            {
                $pull: { pendingInvitations: { user: userObjId } },
            }
        )
        return
    } catch (error) {
        throw error
    }
}

const addMemberToGroup = async (userId: string, groupId: string): Promise<void> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)
        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "members.user": { $ne: userObjId }
            },
            {
                $push: { members: { user: userObjId, joinAt: new Date() } }
            }
        )
        return
    } catch (error) {
        throw error
    }
}

const removeMemberFromGroup = async (userId: string, groupId: string): Promise<void> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const groupObjId = new mongoose.Types.ObjectId(groupId)
        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "members.user": { $eq: userObjId }
            },
            {
                $pull: { members: { user: userObjId } }
            }
        )
        return
    } catch (error) {
        throw error
    }
}

const getAllPendingInvitations = async (groupId: string) => {
    try {
        const group = await GroupModel.findById(groupId, 'pendingInvitations')
            .populate('pendingInvitations.user', 'displayName avatar')
            .exec();

        if (!group) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        return group.pendingInvitations;
    } catch (error) {
        throw error
    }
}

const getAllMembers = async (groupId: string) => {
    try {
        const group = await GroupModel.findById(groupId, 'members')
            .populate('members.user', 'displayName avatar')
            .exec();

        if (!group) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        return group.members;
    } catch (error) {
        throw error
    }
}

const searchGroups = async (userId: string, search : string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const groups = await GroupModel.aggregate([
            {
                $match: {
                    name: { $regex: search, $options: "i" }
                }
            },
            {
                $addFields: {
                    isMember: { $in: [userObjectId, "$members.user"] },
                    isPending: { $in: [userObjectId, "$pendingInvitations.user"] }
                }
            },
            {
                $addFields: {
                    status: {
                        $cond: {
                            if: "$isMember",
                            then: "joined",
                            else: {
                                $cond: {
                                    if: "$isPending",
                                    then: "pending",
                                    else: "not_joined"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    owner: 1,
                    background_cover: 1,
                    isPublic: 1,
                    status: 1
                }
            }
        ]);
        return groups;
    } catch (error) {
        throw error;
    }
};

export const groupService = {
    create,
    isMemberGroup,
    isOwnerGroup,
    addPendingInvitations,
    acceptPendingInvitations,
    removePendingInvitations,
    addMemberToGroup,
    removeMemberFromGroup,
    getAllPendingInvitations,
    getAllMembers,
    getGroupById,
    searchGroups,
}