import { PaginatedResponse } from "@/dtos/PaginatedResponse"
import ChannelModel from "@/models/channel"
import mongoose from "mongoose"

const getDetail = async (myId, channelId) => {
    try {
        const myObjectId = new mongoose.Types.ObjectId(myId);
        const channelObjectId = new mongoose.Types.ObjectId(channelId);

        const channel = await ChannelModel.findOne(
            {
                _id: channelObjectId,
                participants: { $in: [myObjectId] }
            }
        ).populate({
            path: 'participants',
            select: '_id avatar displayName'
        }).select('-messages')
        return channel;
    } catch (error) {
        throw error;
    }
};


const getAll = async ({ userId, page, size, sort }: {
    userId: string,
    page: number,
    size: number,
    sort: 1 | -1
}): Promise<PaginatedResponse> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);


        const channels = await ChannelModel.aggregate([
            {
                $match: {
                    participants: { $in: [userObjectId] },
                    messages: { $ne: null },
                },
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: 'messages',
                    foreignField: '_id',
                    as: 'messagesDetails',
                },
            },
            {
                $match: {
                    'messagesDetails.0': { $exists: true },
                },
            },

            {
                $project: {
                    _id: 1,
                    updatedAt: 1,
                    participants: 1,
                    isRead: 1,
                    readAt: 1,
                    messagesDetails: { $sortArray: { input: '$messagesDetails', sortBy: { createdAt: -1 } } },
                },
            },
            {
                $sort: { updatedAt: -1 },
            },
            {
                $skip: (page - 1) * size,
            },
            {
                $limit: size,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'participantsDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    updatedAt: 1,
                    isRead: 1,
                    readAt: 1,
                    participantsDetails: {
                        _id: 1,
                        avatar: 1,
                        displayName: 1,
                    },
                    latestMessage: { $arrayElemAt: ['$messagesDetails', 0] },
                },
            },
        ]);

        const totalChannels = await ChannelModel.countDocuments({
            participants: userObjectId,
            messages: { $exists: true, $not: { $size: 0 } },
        });

        const totalPages = Math.ceil(totalChannels / size);

        return {
            data: channels,
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalChannels,
        };
    } catch (error) {
        throw error;
    }
};

const create = async ({ userId, friendId }: { userId: string, friendId: string }) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        console.log('🚀 ~ create ~ userObjectId:', userObjectId)
        console.log('🚀 ~ create ~ friendObjectId:', friendObjectId)

        const channel = await ChannelModel.findOneAndUpdate(
            {
                participants:
                {
                    $all: [
                        { "$elemMatch": { $eq: userObjectId } },
                        { "$elemMatch": { $eq: friendObjectId } }
                    ]
                }
            },
            {
                $setOnInsert: {
                    participants: [userObjectId, friendObjectId],
                }
            },
            {
                new: true,
                upsert: true
            }
        ).populate({
            path: 'participants',
            select: '_id displayName avatar'
        });

        return channel
    } catch (error) {
        throw error
    }
}

export const channelService = {
    getAll,
    getDetail,
    create,
}