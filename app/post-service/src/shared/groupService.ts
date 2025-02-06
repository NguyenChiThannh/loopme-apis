import mongoose from "mongoose"
import { GroupModel } from "@/models/post"

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

export const groupService = {
    isOwnerGroup,
}