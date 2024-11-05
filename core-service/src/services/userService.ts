import UserModel, { UserUpdateData } from "@/models/user";
import mongoose from "mongoose";

const searchUser = async (name : string, userId : string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)

        const result = await UserModel.aggregate([
            {
                $match: {
                    displayName: { $regex: name, $options: "i" },
                    _id: { $ne: userObjectId }
                }
            },
            {
                $project: {
                    _id: 1,
                    displayName: 1,
                    avatar: 1
                }
            },
            {
                $lookup: {
                    from: "friends",
                    let: { friendId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $and: [{ $eq: ["$sender", userObjectId] }, { $eq: ["$receiver", "$$friendId"] }] },
                                        { $and: [{ $eq: ["$receiver", userObjectId] }, { $eq: ["$sender", "$$friendId"] }] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                status: 1
                            }
                        }
                    ],
                    as: "friendStatus"
                }
            },
            {
                $addFields: {
                    friendStatus: { $arrayElemAt: ["$friendStatus.status", 0] }
                }
            }
        ]);

        return result;

    } catch (error) {
        throw error
    }
};


const updateUser = async (data: UserUpdateData, userId) => {
    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(userId),
            { $set: data },
            { new: true, runValidators: true }
        ).select('_id displayName avatar');
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const getUser = async (userId: string) => {
    try {
        const user = await UserModel.findOne(
            { _id: new mongoose.Types.ObjectId(userId) }
        ).select('_id displayName avatar')

        return user;
    } catch (error) {
        throw error;
    }
};


export const userService = {
    searchUser,
    updateUser,
    getUser
} 