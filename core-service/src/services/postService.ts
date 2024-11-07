import mongoose from 'mongoose';
import PostModel from "../models/post"
import GroupModel from '@/models/group';
import FriendModel from '@/models/friend';
import { friendService } from '@/services/friendSerive';
import { notificationService } from '@/services/notificationService';
import { CustomError } from '@/config/customError';
import { ResponseMessages } from '@/utils/messages';

const create = async (data) => {
    try {
        if (data.group) {
            data.privacy = 'private'
        }
        const post = await PostModel.create(data)
        await post.populate('user', 'displayName avatar _id')
        if (data.groupId) {
            await post.populate('group', 'name _id')
        }
        return post.toObject()
    } catch (error) {
        throw error
    }
}

const getById = async (postId: string, userId: string) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const post = await PostModel.aggregate([
            {
                $match: { _id: postObjectId }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "groupDetails"
                }
            },
            {
                $unwind: {
                    path: "$groupDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user",
                    foreignField: "_id",
                    as: "commentUserDetails"
                }
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                _id: "$$comment._id",
                                value: "$$comment.value",
                                createdAt: "$$comment.createdAt",
                                updatedAt: "$$comment.updatedAt",
                                user: {
                                    $let: {
                                        vars: {
                                            user: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$commentUserDetails",
                                                            as: "userDetail",
                                                            cond: { $eq: ["$$userDetail._id", "$$comment.user"] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        },
                                        in: {
                                            _id: "$$user._id",
                                            displayName: "$$user.displayName",
                                            avatar: "$$user.avatar"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    privacy: 1,
                    images: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: 1,
                    "user": {
                        _id: "$userDetails._id",
                        displayName: "$userDetails.displayName",
                        avatar: "$userDetails.avatar"
                    },
                    "group": {
                        _id: "$groupDetails._id",
                        name: "$groupDetails.name"
                    },
                    voteValue: {
                        $let: {
                            vars: {
                                userVote: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$votes",
                                                as: "vote",
                                                cond: { $eq: ["$$vote.user", userObjectId] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            },
                            in: {
                                $cond: {
                                    if: { $ifNull: ["$$userVote", false] },
                                    then: "$$userVote.value",
                                    else: null
                                }
                            }
                        }
                    },
                    totalVotes: {
                        $subtract: [
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "UPVOTE"] }
                                    }
                                }
                            },
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "DOWNVOTE"] }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]);
        return post
    } catch (error) {
        throw error
    }
}

const getPostsByGroupId = async ({ groupId, userId, page, size, sort }: {
    groupId: string;
    userId: string;
    page: number;
    size: number;
    sort: 1 | -1
}) => {
    try {
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const post = await PostModel.aggregate([
            {
                $match: { group: groupObjectId }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "groupDetails"
                }
            },
            {
                $unwind: {
                    path: "$groupDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    privacy: 1,
                    images: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "user": {
                        _id: "$userDetails._id",
                        displayName: "$userDetails.displayName",
                        avatar: "$userDetails.avatar"
                    },
                    "group": {
                        _id: "$groupDetails._id",
                        name: "$groupDetails.name"
                    },
                    voteValue: {
                        $let: {
                            vars: {
                                userVote: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$votes",
                                                as: "vote",
                                                cond: { $eq: ["$$vote.user", userObjectId] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            },
                            in: {
                                $cond: {
                                    if: { $ifNull: ["$$userVote", false] },
                                    then: "$$userVote.value",
                                    else: null
                                }
                            }
                        }
                    },
                    totalVotes: {
                        $subtract: [
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "UPVOTE"] }
                                    }
                                }
                            },
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "DOWNVOTE"] }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            },
            {
                $sort: { createdAt: sort },
            }
        ]);
        const totalPosts = await PostModel.countDocuments({ group: groupObjectId });
        const totalPages = Math.ceil(totalPosts / size);

        return {
            data: post,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null
        }
    } catch (error) {
        throw error
    }

}

const getPostsByUserId = async ({ myId, userId, page, size, sort }: {
    myId: string;
    userId: string;
    page: number;
    size: number;
    sort: 1 | -1
}) => {
    try {
        const isMyself = myId === userId;
        const myObjectId = new mongoose.Types.ObjectId(myId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        let posts;
        let totalPages;

        if (isMyself) {
            posts = await PostModel.find({
                user: userObjectId,
                group: null,
            }).sort({ createdAt: sort })
                .skip((page - 1) * size)
                .limit(size);

            const totalPosts = await PostModel.countDocuments({ user: userObjectId, group: null });
            totalPages = Math.ceil(totalPosts / size);
        } else {
            const isFriend = await FriendModel.findOne(
                {
                    $or: [
                        { sender: myObjectId, receiver: userObjectId, status: 'accepted' },
                        { sender: userObjectId, receiver: myObjectId, status: 'accepted' }
                    ]
                }
            ) ? true : false;

            const privacyFilter = isFriend
                ? { privacy: { $in: ['public', 'friends'] } }
                : { privacy: 'public' };

            const totalPosts = await PostModel.countDocuments({ user: userObjectId, group: null, ...privacyFilter });
            totalPages = Math.ceil(totalPosts / size);

            posts = await PostModel.find({
                user: userObjectId,
                group: null,
                ...privacyFilter
            })
                .sort({ createdAt: sort })
                .skip((page - 1) * size)
                .limit(size);
        }

        return {
            data: posts,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null
        };
    } catch (error) {
        throw error;
    }
};

const getPosts = async ({ userId, page, size, sort }: {
    userId: string;
    page: number;
    size: number;
    sort: 1 | -1
}) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const groupIdsResult = await GroupModel.aggregate([
            {
                $match: { "members.user": userObjectId }
            },
            {
                $group: {
                    _id: null,
                    groupIds: { $push: "$_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    groupIds: 1
                }
            }
        ]);
        const groupIds = groupIdsResult.length > 0 ? groupIdsResult[0].groupIds : [];

        const friendIds = await friendService.getFriendIds(userObjectId)

        const posts = await PostModel.aggregate([
            {
                $match: {
                    $or: [
                        { group: { $in: groupIds } },
                        { privacy: "public" },
                        { user: { $in: friendIds } },
                        { user: userId }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "groupDetails"
                }
            },
            {
                $unwind: {
                    path: "$groupDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    privacy: 1,
                    images: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "user": {
                        _id: "$userDetails._id",
                        displayName: "$userDetails.displayName",
                        avatar: "$userDetails.avatar"
                    },
                    "group": {
                        _id: "$groupDetails._id",
                        name: "$groupDetails.name"
                    },
                    voteValue: {
                        $let: {
                            vars: {
                                userVote: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$votes",
                                                as: "vote",
                                                cond: { $eq: ["$$vote.user", userObjectId] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            },
                            in: {
                                $cond: {
                                    if: { $ifNull: ["$$userVote", false] },
                                    then: "$$userVote.value",
                                    else: null
                                }
                            }
                        }
                    },
                    totalVotes: {
                        $subtract: [
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "UPVOTE"] }
                                    }
                                }
                            },
                            {
                                $size: {
                                    $filter: {
                                        input: "$votes",
                                        as: "vote",
                                        cond: { $eq: ["$$vote.value", "DOWNVOTE"] }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            },
            {
                $sort: { createdAt: sort },
            }
        ]);

        const totalPosts = await PostModel.countDocuments({
            $or: [
                { group: { $in: groupIds } },
                { privacy: "public" },
                { user: { $in: friendIds } }
            ]
        });
        const totalPages = Math.ceil(totalPosts / size);

        return {
            data: posts,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null
        }
    } catch (error) {
        throw error
    }

}

const upvote = async (postId: string, userId: string): Promise<void> => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const post = await PostModel.findById(postObjectId).select('user');

        if (!post) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        await PostModel.updateOne(
            { _id: postObjectId },
            [
                {
                    $set: {
                        votes: {
                            $cond: {
                                if: {
                                    $in: [userObjectId, '$votes.user']
                                },
                                then: {
                                    $map: {
                                        input: '$votes',
                                        as: 'vote',
                                        in: {
                                            $cond: {
                                                if: { $eq: ['$$vote.user', userObjectId] },
                                                then: { user: userObjectId, value: 'UPVOTE' },
                                                else: '$$vote'
                                            }
                                        }
                                    }
                                },
                                else: {
                                    $concatArrays: ['$votes', [{ user: userObjectId, value: 'UPVOTE' }]]
                                }
                            }
                        }
                    }
                }
            ]
        )
        // Send notifications
        await notificationService.create({
            actor: userId,
            recipient: post.user.toString(),
            postId: postId,
            type: 'like',
        })
        return
    } catch (error) {
        throw error
    }
}

const downvote = async (postId: string, userId: string): Promise<void> => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)
        const userObjectId = new mongoose.Types.ObjectId(userId)

        const post = await PostModel.findById(postObjectId).select('user');

        if (!post) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        await PostModel.updateOne(
            { _id: postObjectId },
            [
                {
                    $set: {
                        votes: {
                            $cond: {
                                if: {
                                    $in: [userObjectId, '$votes.user']
                                },
                                then: {
                                    $map: {
                                        input: '$votes',
                                        as: 'vote',
                                        in: {
                                            $cond: {
                                                if: { $eq: ['$$vote.user', userObjectId] },
                                                then: { user: userObjectId, value: 'DOWNVOTE' },
                                                else: '$$vote'
                                            }
                                        }
                                    }
                                },
                                else: {
                                    $concatArrays: ['$votes', [{ user: userObjectId, value: 'DOWNVOTE' }]]
                                }
                            }
                        }
                    }
                }
            ]
        );
        // Send notifications
        await notificationService.create({
            actor: userId,
            recipient: post.user.toString(),
            postId: postId,
            type: 'dislike',
        })
        return
    } catch (error) {
        throw error
    }
}

const removevote = async (postId: string, userId: string): Promise<void> => {
    try {
        await PostModel.updateOne(
            { _id: new mongoose.Types.ObjectId(postId) },
            {
                $pull: { votes: { user: new mongoose.Types.ObjectId(userId) } }
            }
        );
        return
    } catch (error) {
        throw error
    }
}

const addComment = async ({ postId, userId, content }:
    {
        postId: string,
        userId: string,
        content: string,
    }): Promise<void> => {
    try {

        const post = await PostModel.findById(new mongoose.Types.ObjectId(postId)).select('user');

        if (!post) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        await PostModel.updateOne(
            { _id: new mongoose.Types.ObjectId(postId) },
            {
                $push: {
                    comments:
                    {
                        user: new mongoose.Types.ObjectId(userId),
                        value: content,
                    }
                }
            }
        );

        await notificationService.create({
            actor: userId,
            recipient: post.user.toString(),
            groupId: postId,
            type: 'comment',
        })
        return
    } catch (error) {
        throw error
    }
}

const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    try {
        await PostModel.updateOne(
            { _id: new mongoose.Types.ObjectId(postId) },
            {
                $pull: { comments: { _id: new mongoose.Types.ObjectId(commentId) } }
            }
        );
        return
    } catch (error) {
        throw error
    }
}

export const postService = {
    create,
    getById,
    getPostsByGroupId,
    getPostsByUserId,
    getPosts,
    upvote,
    downvote,
    removevote,
    addComment,
    deleteComment,
}