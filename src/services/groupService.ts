import GroupModel from "@/models/group"
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

const isMemberGroup = async (userId, groupId) => {
    try {
        const userObjId = new mongoose.Types.ObjectId(`${userId}`)
        const groupObjId = new mongoose.Types.ObjectId(`${groupId}`)

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

const isOwnerGroup = async (userId, groupId) => {
    try {
        const userObjId = new mongoose.Types.ObjectId(`${userId}`)
        const groupObjId = new mongoose.Types.ObjectId(`${groupId}`)

        const group = await GroupModel.findOne({
            _id: groupObjId,
            owner: userObjId,
        });

        return group !== null;
    } catch (error) {
        throw error;
    }
};

export const groupService = {
    create,
    isMemberGroup,
    isOwnerGroup,
}