import { PaginatedResponse } from "@/dtos/PaginatedResponse";
import UserModel, { filterData, UserUpdateData } from "@/models/user";
import mongoose from "mongoose";

const searchUser = async ({ userId, name, page, size, sort }: {
    userId: string,
    name: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)

        const friends = await UserModel.aggregate([
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
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            },
            {
                $sort: { name: sort }
            }
        ]);

        const totalDocuments = await UserModel.countDocuments({
            displayName: { $regex: name, $options: "i" },
            _id: { $ne: userObjectId }
        });

        const totalPages = Math.ceil(totalDocuments / size);

        return {
            data: friends,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
        };

    } catch (error) {
        throw error
    }
};

const updateUser = async (data: Partial<UserUpdateData>, userId: string) => {
    try {
        const filteredData = filterData(data, ["displayName", "avatar"]);

        const updatedUser = await UserModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(userId),
            { $set: filteredData },
            { new: true, runValidators: true }
        ).select('_id displayName avatar email isActive createdAt __v')

        return updatedUser;
    } catch (error) {
        throw error;
    }
};


const getUser = async (userId: string) => {
    try {
        const user = await UserModel.findOne(
            { _id: new mongoose.Types.ObjectId(userId) }
        ).select('_id displayName avatar email isActive createdAt __v')

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