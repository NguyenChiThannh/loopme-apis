import mongoose from "mongoose"
import { PaginatedResponse } from "@loopme/common";
import { ChannelModel } from '@loopme/common'

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
                $match: { participants: userObjectId },
            },
            {
                $lookup: {
                    from: "messages",
                    let: { channelId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$channel", "$$channelId"] },
                            },
                        },
                        {
                            $sort: { createdAt: -1 },
                        },
                        {
                            $limit: 1,
                        },
                    ],
                    as: "lastMessage",
                },
            },
            {
                $match: { lastMessage: { $ne: [] } },
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                avatar: 1,
                                displayName: 1,
                            },
                        },
                    ],
                    as: "participants",
                },
            },
            {
                $sort: { "lastMessage.createdAt": sort },
            },
            {
                $skip: (page - 1) * size,
            },
            {
                $limit: size,
            },
        ]);

        const totalChannels = await ChannelModel.aggregate([
            {
                $match: { participants: userObjectId },
            },
            {
                $lookup: {
                    from: "messages",
                    let: { channelId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$channel", "$$channelId"] },
                            },
                        },
                    ],
                    as: "messages",
                },
            },
            {
                $match: { messages: { $ne: [] } },
            },
            {
                $count: "total",
            },
        ]);

        const totalElements = totalChannels.length > 0 ? totalChannels[0].total : 0;
        const totalPages = Math.ceil(totalElements / size);

        return {
            data: channels.map(channel => ({
                ...channel,
                participants: channel.participants, // Gắn `participants` trực tiếp vào output
            })),
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null,
            totalElement: totalElements,
        };
    } catch (error) {
        throw error;
    }
};

const create = async ({ userId, friendId }: { userId: string, friendId: string }) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const friendObjectId = new mongoose.Types.ObjectId(friendId)

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
        })

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