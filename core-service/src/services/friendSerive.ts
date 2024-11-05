import UserModel from "@/models/user"
import FriendModel from "../models/friend"
import mongoose from "mongoose"
import { notificationService } from "@/services/notificationService"

const addPendingInvitations = async (myId: string, friendId: string): Promise<void> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        await FriendModel.updateOne(
            {
                $or: [
                    { sender: myObjectId, receiver: friendObjectId, status: 'pending' },
                    { sender: friendObjectId, receiver: myObjectId, status: 'pending' }
                ]
            },
            {
                $setOnInsert: {
                    sender: myObjectId,
                    receiver: friendObjectId,
                    status: 'pending',
                    sentAt: new Date()
                }
            },
            { upsert: true }
        );
        await notificationService.create({
            actor: myId,
            recipient: friendId,
            type: 'friend_request',
        })
    } catch (error) {
        throw error
    }
}

const removePendingInvitations = async (myId: string, friendId: string): Promise<void> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        await FriendModel.deleteOne(
            {
                $or: [
                    { sender: myObjectId, receiver: friendObjectId, status: 'pending' },
                    { sender: friendObjectId, receiver: myObjectId, status: 'pending' }
                ]
            }
        );
        return
    } catch (error) {
        throw error
    }
}

const acceptInvitations = async (myId: string, friendId: string): Promise<void> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        await FriendModel.updateOne(
            {
                receiver: myObjectId, sender: friendObjectId, status: 'pending'
            },
            {
                $set: {
                    status: 'accepted',
                    acceptedAt: new Date()
                }
            }
        );

        await notificationService.create({
            actor: myId,
            recipient: friendId,
            type: 'accept_friend',
        })
    } catch (error) {
        throw error
    }
}

const removeFriend = async (myId: string, friendId: string): Promise<void> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        await FriendModel.deleteOne(
            {
                $or: [
                    { sender: myObjectId, receiver: friendObjectId, status: 'accepted' },
                    { sender: friendObjectId, receiver: myObjectId, status: 'accepted' }
                ]
            })
    } catch (error) {
        throw error
    }
}

const getAllFriend = async ({ userId, page, size }: {
    userId: string,
    page: number,
    size: number
}) => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const skip: number = (page - 1) * size;
        const friendsList = await FriendModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { sender: userObjId },
                                { receiver: userObjId }
                            ]
                        },
                        {
                            status: "accepted"
                        }
                    ]
                }
            },
            {
                $project: {
                    userId: {
                        $cond: {
                            if: { $eq: ["$sender", userObjId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    acceptedAt: 1,
                    _id: 0
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $replaceWith: {
                    $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"]
                }
            },
            {
                $project: {
                    _id: 1,
                    displayName: 1,
                    avatar: 1,
                    acceptedAt: 1,
                }
            },
            { $skip: skip },
            { $limit: size }
        ]);

        // const totalFriends : number = await FriendModel.countDocuments({
        //     $and: [
        //         {
        //             $or: [
        //                 { sender: userObjId },
        //                 { receiver: userObjId }
        //             ]
        //         },
        //         {
        //             status: "accepted"
        //         }
        //     ]
        // });

        // const totalPages :number = Math.ceil(totalFriends / size);
        return friendsList
    } catch (error) {
        throw error
    }
}

const getAllInvitationsFriend = async (userId: string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const invitations = await FriendModel.find({
            receiver: userObjectId,
            status: 'pending'
        })
            .populate('sender', 'displayName avatar _id')
            .select('-receiver -_id -status');
        return invitations;
    } catch (error) {
        throw error
    }
}

const suggestMutualFriends = async (userId: string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const friendIds = await getFriendIds(userObjectId)
        const mutualFriends = await UserModel.find(
            {
                $and: [
                    { _id: { $nin: friendIds } },
                    { _id: { $ne: userObjectId } }
                ]
            },
            { displayName: 1, avatar: 1 }
        )
            .limit(4);
        return mutualFriends
    } catch (error) {
        throw error
    }
}

const getFriendIds = async (userObjectId) => {
    const friendIdsResult = await FriendModel.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { sender: userObjectId },
                            { receiver: userObjectId }
                        ]
                    },
                    {
                        status: "accepted"
                    }
                ]
            }
        },
        {
            $project: {
                userId: {
                    $cond: {
                        if: { $eq: ["$sender", userObjectId] },
                        then: "$receiver",
                        else: "$sender"
                    }
                },
                _id: 0
            }
        },
        {
            $group: {
                _id: null,
                friendIds: { $push: "$userId" }
            }
        },
        {
            $project: {
                _id: 0,
                friendIds: 1
            }
        }
    ])
    const friendIds = friendIdsResult.length > 0 ? friendIdsResult[0].friendIds : [];
    return friendIds
}

export const friendService = {
    addPendingInvitations,
    removePendingInvitations,
    acceptInvitations,
    removeFriend,
    getAllFriend,
    getAllInvitationsFriend,
    suggestMutualFriends,
    getFriendIds,
}