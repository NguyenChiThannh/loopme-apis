import { CommentModel } from '@loopme/common'
import mongoose from "mongoose";

const getCommentsInPost = async (postId: string) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)
        return await CommentModel.find({ post: postObjectId })
            .populate('user', '_id displayName avatar')
            .select('-post')

    } catch (error) {
        throw error
    }
}

export const commentService = {
    getCommentsInPost,
}