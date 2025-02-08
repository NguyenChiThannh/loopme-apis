import mongoose from "mongoose"
import { ENV_Common, PaginatedResponse, RabbitMQService } from "@loopme/common"
import { FriendModel, UserModel } from "@loopme/common"

const addPendingInvitations = async (myId: string, friendId: string): Promise<void> => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        await FriendModel.updateOne(
            {
                $or: [
                    { sender: myObjectId, receiver: friendObjectId, status: 'pending' },
                    { sender: friendObjectId, receiver: myObjectId, status: 'pending' },
                    { sender: myObjectId, receiver: friendObjectId, status: 'accepted' },
                    { sender: friendObjectId, receiver: myObjectId, status: 'accepted' },
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

        // Create Notification
        const notificationData = {
            actor: myId,
            receiver: friendId,
            type: 'friend_request',
        }

        // Pub message to the notification service 

        const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

        notificationMessage.publishMessage("Notification", notificationData)
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
                sender: friendObjectId, receiver: myObjectId, status: 'pending'
            },
            {
                $set: {
                    status: 'accepted',
                    acceptedAt: new Date()
                }
            }
        );

        // Create Notification
        const notificationData = {
            actor: myId,
            receiver: friendId,
            type: 'accept_friend',
        }

        // Pub message to the notification service 

        const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

        notificationMessage.publishMessage("Notification", notificationData)
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
        return
    } catch (error) {
        throw error
    }
}

const getAllFriend = async ({ userId, page, size, sort }: {
    userId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const skip: number = (page - 1) * size
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
                    "_id": 1,
                    "displayName": 1,
                    "avatar": 1,
                    "acceptedAt": 1,
                }
            },
            { $sort: { acceptedAt: sort } },
            { $skip: skip },
            { $limit: size },
        ]);

        const totalFriends: number = await FriendModel.countDocuments({
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
        });

        const totalPages: number = Math.ceil(totalFriends / size);
        return {
            data: friendsList,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalFriends,
        }
    } catch (error) {
        throw error
    }
}

const getAllInvitationsFriend = async ({ userId, page, size, sort }: {
    userId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const totalinvitations = await FriendModel.countDocuments({
            receiver: userObjectId,
            status: 'pending'
        });

        const totalPages = Math.ceil(totalinvitations / size);
        const invitations = await FriendModel
            .find({
                receiver: userObjectId,
                status: 'pending'
            })
            .populate('sender', 'displayName avatar _id')
            .select('-receiver -_id -status')
            .skip((page - 1) * size)
            .limit(size)
            .sort({ createdAt: sort })

        return {
            data: invitations,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalinvitations
        };

    } catch (error) {
        throw error;
    }
};

const suggestMutualFriends = async (userId: string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const friendIdsResult = await FriendModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userObjectId },
                        { receiver: userObjectId }
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