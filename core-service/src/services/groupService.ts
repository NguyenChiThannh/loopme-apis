import { CustomError } from "../config/customError"
import GroupModel from "../models/group"
import { ResponseMessages } from "../utils/messages"
import mongoose from "mongoose"

const create = async (data) => {
    try {
        const group = new GroupModel({
            ...data,
            ownerId: data.userId,
        })
        group.save()
        return group.toObject()
    } catch (error) {
        throw error
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
                            { $in: [userObjId, "$members.userId"] },
                            { $eq: [userObjId, "$ownerId"] },
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
            ownerId: userObjId,
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
        console.log('🚀 ~ addPendingInvitations ~ groupObjId:', groupObjId)
        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "members.userId": { $ne: userObjId },
                "pendingInvitations.userId": { $ne: userObjId }
            },
            {
                $push: { pendingInvitations: { userId: userObjId, joinAt: new Date() } }
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
        await GroupModel.updateOne(
            {
                _id: groupObjId,
                "pendingInvitations.userId": { $eq: userObjId }
            },
            {
                $pull: { pendingInvitations: { userId: userObjId } },
                $push: { members: { userId: userObjId, joinAt: new Date() } }
            }
        )
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
                "pendingInvitations.userId": { $eq: userObjId }
            },
            {
                $pull: { pendingInvitations: { userId: userObjId } },
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
                "members.userId": { $ne: userObjId }
            },
            {
                $push: { members: { userId: userObjId, joinAt: new Date() } }
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
                "members.userId": { $eq: userObjId }
            },
            {
                $pull: { members: { userId: userObjId } }
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
            .populate('pendingInvitations.userId', 'displayName avatar')
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
            .populate('members.userId', 'displayName avatar')
            .exec();

        if (!group) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        return group.members;
    } catch (error) {
        throw error
    }
}

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
}