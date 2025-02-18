import { VoteModel } from '@loopme/common'
import mongoose from "mongoose"
import { CustomError, ENV_Common, RabbitMQService } from "@loopme/common"
import { ResponseMessages } from "@loopme/common"
import { transport } from "@/transport"

const vote = async ({
    userId,
    postId,
    voteValue,
    accessToken,
}: { userId: string, postId: string, voteValue: 'UPVOTE' | 'DOWNVOTE', accessToken: string }): Promise<void> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const postObjectId = new mongoose.Types.ObjectId(postId)

        const post = await transport.getPost(postId, accessToken)

        if (!post) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        await VoteModel.findOneAndUpdate(
            { user: userObjectId, post: postObjectId },
            {
                $set: { value: voteValue === 'UPVOTE' ? 'UPVOTE' : 'DOWNVOTE' },
            },
            {
                $setOnInsert: {
                    user: userObjectId,
                    post: postObjectId,
                },
                upsert: true,
                new: true,
            }
        );

        // Create Notification
        if (userId !== post.user.toString()) {
            const notificationData = {
                actor: userId,
                receiver: post.user._id.toString(),
                postId: postId,
                type: voteValue === 'UPVOTE' ? 'like' : 'dislike',
            }

            // Pub message to the notification service 

            const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

            notificationMessage.publishMessage("Notification", notificationData)

        }
        return
    } catch (error) {
        throw error
    }
}

const removevote = async (userId: string, postId: string): Promise<void> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const postObjectId = new mongoose.Types.ObjectId(postId);

        const result = await VoteModel.findOneAndDelete({
            user: userObjectId,
            post: postObjectId
        });

        if (!result) throw new CustomError(404, ResponseMessages.NOT_FOUND)
        return
    } catch (error) {
        throw error
    }
}

const getValueVote = async (userId, postId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const postObjectId = new mongoose.Types.ObjectId(postId);

        const vote = await VoteModel.findOne({
            user: userObjectId,
            post: postObjectId
        })
        return vote ? vote.value : null
    } catch (error) {
        throw error
    }
}

const totalVotesInPost = async (userId, postId) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);

        const result = await VoteModel.aggregate([
            { $match: { post: postObjectId } },
            {
                $group: {
                    _id: "$post",
                    upVotes: { $sum: { $cond: [{ $eq: ["$value", "UPVOTE"] }, 1, 0] } },
                    downVotes: { $sum: { $cond: [{ $eq: ["$value", "DOWNVOTE"] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVotes: { $subtract: ["$upVotes", "$downVotes"] }
                }
            }
        ]);

        return result.length > 0 ? result[0].totalVotes : 0;
    } catch (error) {
        throw error;
    }
};

const getVotesForPosts = async (userId, postIds) => {
    try {
        const votes = await VoteModel.find({ user: userId, post: { $in: postIds } })
            .select('post value')
        return votes.map(vote => ({
            postId: vote.post.toString(),
            voteValue: vote.value
        }));
    } catch (error) {
        throw error;
    }
}

const totalVotesForPosts = async (postIds) => {
    try {
        const totalVotes = await VoteModel.aggregate([
            { $match: { post: { $in: postIds } } },
            {
                $group: {
                    _id: "$post",
                    totalUpvotes: { $sum: { $cond: [{ $eq: ["$value", "UPVOTE"] }, 1, 0] } },
                    totalDownvotes: { $sum: { $cond: [{ $eq: ["$value", "DOWNVOTE"] }, 1, 0] } }
                },
            },
            {
                $project: {
                    _id: 1,
                    totalVotes: { $subtract: ["$totalUpvotes", "$totalDownvotes"] },
                    totalUpvotes: 1,
                    totalDownvotes: 1
                }
            }
        ]);


        const postVotesMap = new Map(
            totalVotes.map(vote => [
                vote._id.toString(),
                { totalVotes: vote.totalVotes, totalUpvotes: vote.totalUpvotes, totalDownvotes: vote.totalDownvotes }
            ])
        );

        return postVotesMap;
    }

    catch (error) {
        throw error;
    }
};

export const voteService = {
    vote,
    removevote,
    getValueVote,
    totalVotesInPost,
    getVotesForPosts,
    totalVotesForPosts,
}