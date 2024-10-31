import mongoose from 'mongoose';
import PostModel from "../models/post"

const create = async (data) => {
    try {
        if (data.groupId) {
            data.privacy = 'public'
        }
        const post = new PostModel(data)
        await post.save()
        return post.toObject()
    } catch (error) {
        throw error
    }
}

const upvote = async (postId: string, userId: string): Promise<void> => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);
        await PostModel.updateOne(
            { _id: postObjectId },
            [
                {
                    $set: {
                        votes: {
                            $cond: {
                                if: {
                                    $in: [userObjectId, '$votes.userId']
                                },
                                then: {
                                    $map: {
                                        input: '$votes',
                                        as: 'vote',
                                        in: {
                                            $cond: {
                                                if: { $eq: ['$$vote.userId', userObjectId] },
                                                then: { userId: userObjectId, value: 'UPVOTE' },
                                                else: '$$vote'
                                            }
                                        }
                                    }
                                },
                                else: {
                                    $concatArrays: ['$votes', [{ userId: userObjectId, value: 'UPVOTE' }]]
                                }
                            }
                        }
                    }
                }
            ]
        );
        return
    } catch (error) {
        throw error
    }
}

const downvote = async (postId: string, userId: string): Promise<void> => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)
        const userObjectId = new mongoose.Types.ObjectId(userId)
        await PostModel.updateOne(
            { _id: postObjectId },
            [
                {
                    $set: {
                        votes: {
                            $cond: {
                                if: {
                                    $in: [userObjectId, '$votes.userId']
                                },
                                then: {
                                    $map: {
                                        input: '$votes',
                                        as: 'vote',
                                        in: {
                                            $cond: {
                                                if: { $eq: ['$$vote.userId', userObjectId] },
                                                then: { userId: userObjectId, value: 'DOWNVOTE' },
                                                else: '$$vote'
                                            }
                                        }
                                    }
                                },
                                else: {
                                    $concatArrays: ['$votes', [{ userId: userObjectId, value: 'DOWNVOTE' }]]
                                }
                            }
                        }
                    }
                }
            ]
        );
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
                $pull: { votes: { userId: new mongoose.Types.ObjectId(userId) } }
            }
        );
        return
    } catch (error) {
        throw error
    }
}

export const postService = {
    create,
    upvote,
    downvote,
    removevote,
}