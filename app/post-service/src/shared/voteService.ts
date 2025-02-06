import { VoteModel } from "@/models/post"
import mongoose from "mongoose"

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
    getValueVote,
    totalVotesInPost,
    getVotesForPosts,
    totalVotesForPosts,
}