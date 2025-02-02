import { CustomError } from "@/configs/customError";
import GroupModel from "@/models/group"
import { ResponseMessages } from "@/utils/messages";
import mongoose from "mongoose"

const getMembersInGroup = async (groupId?: string) => {
    try {
        let pipeline = [];

        if (groupId) {
            const groupObjectId = new mongoose.Types.ObjectId(groupId);
            pipeline.push(
                { $match: { _id: groupObjectId } }
            );
        }

        pipeline.push(
            { $unwind: "$members" },
            {
                $lookup: {
                    from: "users",
                    localField: "members.user",
                    foreignField: "_id",
                    as: "memberDetails",
                },
            },
            { $unwind: "$memberDetails" },
            {
                $project: {
                    _id: 0,
                    groupId: "$_id",
                    memberId: "$memberDetails._id",
                    displayName: "$memberDetails.displayName",
                    avatarUrl: "$memberDetails.avatar",
                    "groupName": "$name",
                },
            }
        );

        const members = await GroupModel.aggregate(pipeline);
        return members;
    } catch (error) {
        throw error;
    }
};


const deleteMemberFromGroup = async (groupId: string, memberId: string) => {
    try {
        if (!groupId || !memberId) throw new CustomError(400, ResponseMessages.BAD_REQUEST)
        const groupObjectId = new mongoose.Types.ObjectId(groupId)
        const memberObjectId = new mongoose.Types.ObjectId(memberId)
        const group = await GroupModel.findOneAndUpdate(
            { _id: groupObjectId },
            { $pull: { members: { user: memberObjectId } } },
            { new: true }
        );
        if (!group) {
            throw new CustomError(400, ResponseMessages.NOT_FOUND)
        }
        return
    } catch (error) {
        throw error
    }
}

export const memberService = {
    getMembersInGroup,
    deleteMemberFromGroup,
}