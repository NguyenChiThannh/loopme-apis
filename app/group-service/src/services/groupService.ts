import mongoose from "mongoose"
import { CustomError, ENV_Common, RabbitMQService } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { PaginatedResponse } from "@loopme/common"
import { GroupModel, UserModel } from "@loopme/common"

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
        if (!group)
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        return group
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

        // Create Notification
        const notificationData = {
            actor: userId,
            receiver: group.owner.toString(),
            groupId: groupId,
            type: 'request_to_join_group',
        }
        console.log('🚀 ~ addPendingInvitations ~ notificationData:', notificationData)

        // Pub message to the notification service 

        const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

        notificationMessage.publishMessage("Notification", notificationData)

        return
    } catch (error) {
        throw error
    }
}

const getJoinedGroup = async (userId: string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const groups = await GroupModel.find({
            $or: [
                { "members.user": userObjectId },
                { owner: userObjectId }
            ]
        }).select('-members -pendingInvitations')

        return groups
    } catch (error) {
        throw error;
    }
};

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
        // Create Notification
        const notificationData = {
            actor: group.owner.toString(),
            receiver: userId,
            groupId: groupId,
            type: 'accept_join_group',
        }

        // Pub message to the notification service 

        const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

        notificationMessage.publishMessage("Notification", notificationData)

        return
    } catch (error) {
        throw error
    }
}

const removePendingInvitations = async (userId: string, groupId: string, myId: string): Promise<void> => {
    try {
        if (!(myId === userId) && !isOwnerGroup(userId, groupId))
            throw new CustomError(403, ResponseMessages.FORBIDDEN)
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

const deleteGroupById = async (groupId: string): Promise<void> => {
    try {
        const groupObjId = new mongoose.Types.ObjectId(groupId)
        const group = await GroupModel.findOne(
            {
                _id: groupObjId,
            }
        )
        if (!group)
            throw new CustomError(404, ResponseMessages.NOT_FOUND)
        await GroupModel.deleteOne({
            _id: groupObjId,
        })
        return
    } catch (error) {
        throw error
    }
}

const getAllPendingInvitations = async ({ groupId, page, size, sort }: {
    groupId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const groupObjectId = new mongoose.Types.ObjectId(groupId)
        const group = await GroupModel.findOne({
            _id: groupObjectId,
        })

        if (!group) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        const invitations = await GroupModel
            .findOne({ _id: groupObjectId })
            .select('pendingInvitations -_id')
            .populate('pendingInvitations.user', 'displayName avatar _id')
            .skip((page - 1) * size)
            .limit(size)
            .sort({ createdAt: sort })

        const totalInvitations = group.pendingInvitations.length
        const totalPages = Math.ceil(totalInvitations / size);
        return {
            data: invitations.pendingInvitations,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalInvitations,
        };
    } catch (error) {
        throw error
    }
}

const getAllMembers = async ({ groupId, page, size, sort }: {
    groupId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {

        const groupObjectId = new mongoose.Types.ObjectId(groupId)
        const group = await GroupModel.findOne({
            _id: groupObjectId,
        })

        if (!group) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        const members = await GroupModel
            .findOne({ _id: groupObjectId })
            .select('members -_id')
            .populate('members.user', 'displayName avatar _id')
            .skip((page - 1) * size)
            .limit(size)
            .sort({ createdAt: sort })

        const totalMembers = group.members.length
        const totalPages = Math.ceil(totalMembers / size);
        return {
            data: members.members,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalMembers,
        };
    } catch (error) {
        throw error
    }
}

const searchGroups = async ({ userId, search, page, size, sort }: {
    userId: string,
    search: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
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
                    isOwner: { $eq: ["$owner", userObjectId] },
                    isMember: { $in: [userObjectId, "$members.user"] },
                    isPending: { $in: [userObjectId, "$pendingInvitations.user"] }
                }
            },
            {
                $addFields: {
                    status: {
                        $cond: {
                            if: "$isOwner",
                            then: "joined",
                            else: {
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
                    status: 1,
                }
            },
            {
                $sort: { name: sort }
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            }
        ]);

        const totalGroups = await GroupModel.countDocuments({
            name: { $regex: search, $options: "i" }
        });
        const totalPages = Math.ceil(totalGroups / size);

        return {
            data: groups,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
        };
    } catch (error) {
        throw error;
    }
};

export const groupService = {
    create,
    isMemberGroup,
    isOwnerGroup,
    getJoinedGroup,
    deleteGroupById,
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