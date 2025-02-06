import mongoose from 'mongoose';
import PostModel, { filterData } from "../models/post"
import { GroupModel } from '../models/post';
import { FriendModel } from '../models/post';
import { friendService } from '@/shared/friendSerive';
import { groupService } from '@/shared/groupService';
import { commentService } from '@/shared/commentService';
import { voteService } from '@/shared/voteService';
import { CustomError } from '@loopme/common';
import { ResponseMessages } from '@loopme/common';

const create = async (data) => {
    try {
        if (data.groupId) {
            data.group = data.groupId
            data.privacy = 'private'
            delete data.groupId
        }

        const post = await PostModel.create(data)
        await post.populate('user', 'displayName avatar _id')
        if (data.group) {
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

        const post = await PostModel.findById(postObjectId)
            .populate('user', '_id displayName avatar')
            .populate('group', '_id name')

        if (!post) throw new CustomError(404, ResponseMessages.NOT_FOUND)
        const [comments, voteValue, totalVotes] = await Promise.all([
            commentService.getCommentsInPost(postId),
            voteService.getValueVote(userId, postId),
            voteService.totalVotesInPost(userId, postId)
        ]);
        return {
            ...post.toObject(),
            comments,
            voteValue,
            totalVotes
        }
    } catch (error) {
        throw error
    }
}

const deleteById = async (postId: string, userId: string) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const post = await PostModel.findById(postObjectId);

        if (!post) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        if (post.user.equals(userObjectId)) {
            await PostModel.deleteOne({ _id: postObjectId });
            return;
        }

        if (post.group) {
            const isOwnerGroup = await groupService.isOwnerGroup(userId, post.group.toString());
            if (!isOwnerGroup) {
                throw new CustomError(403, ResponseMessages.FORBIDDEN);
            }
        } else {
            throw new CustomError(403, ResponseMessages.FORBIDDEN);
        }

        await PostModel.deleteOne({ _id: postObjectId });
        return;

    } catch (error) {
        throw error;
    }
};

const updateById = async (postId: string, userId: string, data: any) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const post = await PostModel.findById(postObjectId);

        if (!post) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        if (!post.user.equals(userObjectId)) {
            throw new CustomError(403, ResponseMessages.FORBIDDEN);
        }

        const validData = filterData(data, ["privacy", "content", "images"]);

        await PostModel.updateOne({ _id: postObjectId }, { $set: validData });

        return;
    } catch (error) {
        throw error;
    }
};

const getPostsByGroupId = async ({ groupId, userId, page, size, sort }: {
    groupId: string;
    userId: string;
    page: number;
    size: number;
    sort: 1 | -1
}) => {
    try {
        const groupObjectId = new mongoose.Types.ObjectId(groupId);

        const posts = await PostModel.find({ group: groupObjectId })
            .populate('user', '_id displayName avatar')
            .populate('group', '_id name')
            .sort({ createdAt: sort })
            .skip((page - 1) * size)
            .limit(size);

        const postIds = posts.map(post => post._id);

        const votes = await voteService.getVotesForPosts(userId, postIds);

        const totalVotesForPostsMap = await voteService.totalVotesForPosts(postIds);

        const userVotesMap = new Map(votes.map(vote => [vote.postId.toString(), vote.voteValue]));

        const postsWithVotes = posts.map(post => {
            const postIdStr = post._id.toString();
            const postVote = totalVotesForPostsMap.get(postIdStr) || { totalVotes: 0, totalUpvotes: 0, totalDownvotes: 0 };
            return {
                ...post.toObject(),
                voteValue: userVotesMap.get(postIdStr) || null,
                totalVotes: postVote.totalVotes,
            };
        });

        const totalPosts = await PostModel.countDocuments({ group: groupObjectId });
        const totalPages = Math.ceil(totalPosts / size);

        return {
            data: postsWithVotes,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null
        }
    } catch (error) {
        throw error;
    }
}

const getPostsByUserId = async ({
    userId,
    myId,
    page,
    size,
    sort
}: {
    userId: string;
    myId: string;
    page: number;
    size: number;
    sort: 1 | -1;
}) => {
    try {
        const isMyself = myId === userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const myObjectId = new mongoose.Types.ObjectId(myId);

        let matchStage;
        if (isMyself) {
            matchStage = { user: userObjectId, group: null };
        } else {
            const isFriend = await FriendModel.findOne({
                $or: [
                    { sender: myObjectId, receiver: userObjectId, status: "accepted" },
                    { sender: userObjectId, receiver: myObjectId, status: "accepted" }
                ]
            });

            const privacyFilter = isFriend
                ? { privacy: { $in: ["public", "friends"] } }
                : { privacy: "public" };

            matchStage = { user: userObjectId, group: null, ...privacyFilter };
        }

        const posts = await PostModel.find(matchStage)
            .populate('user', '_id displayName avatar')
            .populate('group', '_id name')
            .sort({ createdAt: sort })
            .skip((page - 1) * size)
            .limit(size);

        const postIds = posts.map(post => post._id);
        const votes = await voteService.getVotesForPosts(myId, postIds);
        const totalVotesForPostsMap = await voteService.totalVotesForPosts(postIds);

        const userVotesMap = new Map(votes.map(vote => [vote.postId.toString(), vote.voteValue]));

        const postsWithVotes = posts.map(post => {
            const postIdStr = post._id.toString();
            const postVote = totalVotesForPostsMap.get(postIdStr) || { totalVotes: 0, totalUpvotes: 0, totalDownvotes: 0 };
            return {
                ...post.toObject(),
                voteValue: userVotesMap.get(postIdStr) || null,
                totalVotes: postVote.totalVotes,
            };
        });

        const totalPosts = await PostModel.countDocuments(matchStage);
        const totalPages = Math.ceil(totalPosts / size);

        return {
            data: postsWithVotes,
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

        const posts = await PostModel.find({
            $or: [
                { group: { $in: groupIds } },
                { privacy: "public" },
                { user: { $in: friendIds } },
                { user: userId }
            ]
        })
            .populate("user", "displayName avatar")
            .populate("group", "name")
            .skip((page - 1) * size)
            .limit(size)
            .sort({ createdAt: sort });

        const postIds = posts.map(post => post._id);

        const votes = await voteService.getVotesForPosts(userId, postIds);

        const totalVotesForPostsMap = await voteService.totalVotesForPosts(postIds);

        const userVotesMap = new Map(votes.map(vote => [vote.postId.toString(), vote.voteValue]));

        const postsWithVotes = posts.map(post => {
            const postIdStr = post._id.toString();
            const postVote = totalVotesForPostsMap.get(postIdStr) || { totalVotes: 0, totalUpvotes: 0, totalDownvotes: 0 };
            return {
                ...post.toObject(),
                voteValue: userVotesMap.get(postIdStr) || null,
                totalVotes: postVote.totalVotes,
            };
        });

        const totalPosts = await PostModel.countDocuments({
            $or: [
                { group: { $in: groupIds } },
                { privacy: "public" },
                { user: { $in: friendIds } }
            ]
        });
        const totalPages = Math.ceil(totalPosts / size);

        return {
            data: postsWithVotes,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            nextCursor: page < totalPages ? page + 1 : null
        }
    } catch (error) {
        throw error
    }

}

export const postService = {
    create,
    getById,
    deleteById,
    updateById,
    getPostsByGroupId,
    getPostsByUserId,
    getPosts,
}