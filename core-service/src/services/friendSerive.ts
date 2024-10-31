import FriendModel from "../models/friend"
import mongoose from "mongoose"

const addPendingInvitations = async (userId1: string, userId2: string) => {
    try {
        const userObjId1 = new mongoose.Types.ObjectId(userId1)
        const userObjId2 = new mongoose.Types.ObjectId(userId2)
        await FriendModel.updateOne(
            {
                $or: [
                    { senderId: userObjId1, receiverId: userObjId2, status: 'pending' },
                    { senderId: userObjId2, receiverId: userObjId1, status: 'pending' }
                ]
            },
            {
                $setOnInsert: {
                    senderId: userObjId1,
                    receiverId: userObjId2,
                    status: 'pending',
                    sentAt: new Date()
                }
            },
            { upsert: true }
        );
    } catch (error) {
        throw error
    }
}

const removePendingInvitations = async (userId1: string, userId2: string) => {
    try {
        const userObjId1 = new mongoose.Types.ObjectId(userId1)
        const userObjId2 = new mongoose.Types.ObjectId(userId2)
        await FriendModel.deleteOne(
            {
                $or: [
                    { senderId: userObjId1, receiverId: userObjId2, status: 'pending' },
                    { senderId: userObjId2, receiverId: userObjId1, status: 'pending' }
                ]
            }
        );
        return
    } catch (error) {
        throw error
    }
}

const acceptInvitations = async (userId1: string, userId2: string) => {
    try {
        const userObjId1 = new mongoose.Types.ObjectId(userId1)
        const userObjId2 = new mongoose.Types.ObjectId(userId2)
        await FriendModel.updateOne(
            {
                senderId: userObjId1, receiverId: userObjId2, status: 'pending'
            },
            {
                $set: {
                    status: 'accepted',
                    acceptedAt: new Date()
                }
            }
        );
    } catch (error) {
        throw error
    }
}

const removeFriend = async (userId1: string, userId2: string) => {
    try {
        const userObjId1 = new mongoose.Types.ObjectId(userId1)
        const userObjId2 = new mongoose.Types.ObjectId(userId2)
        await FriendModel.deleteOne(
            {
                $or: [
                    { senderId: userObjId1, receiverId: userObjId2, status: 'accepted' },
                    { senderId: userObjId2, receiverId: userObjId1, status: 'accepted' }
                ]
            })
    } catch (error) {
        throw error
    }
}

const getAllFriend = async (userId: string) => {
    try {
        const userObjId = new mongoose.Types.ObjectId(userId)
        const friendsList = await FriendModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userObjId },
                        { receiverId: userObjId }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'friendsDetails'
                }
            },
            {
                $unwind: '$friendsDetails'
            },
            {
                $match: {
                    $expr: {
                        $ne: ['$friendsDetails._id', userObjId]
                    }
                }
            },
            {
                $project: {
                    'friendsDetails.name': 1,
                    'friendsDetails.avatar': 1,
                    'friendsDetails._id': 1
                }
            }
        ]);
        return friendsList
    } catch (error) {
        throw error
    }
}

const getAllInvitationsFriend = async (userId: string) => {
    try {

        const invitations = await FriendModel.find({
            receiverId: userId,
            status: 'pending'
        })
            .populate('senderId', 'displayName avatar _id')
            .select('-receiverId');

        return invitations;
    } catch (error) {
        throw error
    }
}

const suggestMutualFriends = async () => {
    try {
        return
    } catch (error) {
        throw error
    }
}

export const friendService = {
    addPendingInvitations,
    removePendingInvitations,
    acceptInvitations,
    removeFriend,
    getAllFriend,
    getAllInvitationsFriend,
    suggestMutualFriends,
}