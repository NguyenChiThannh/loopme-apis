import { CustomError } from "@/config/customError";
import notificationEmitter from "@/config/eventEmitter";
import CommentModel from "@/models/comment";
import PostModel from "@/models/post";
import { ResponseMessages } from "@/utils/messages";
import mongoose from "mongoose";

const create = async ({ userId, postId, content }: {
    userId: string,
    postId: string,
    content: string,
}) => {
    try {
        const newComment = new CommentModel({
            user: userId,
            post: postId,
            content: content,
        });

        const post = await PostModel.findById(postId)

        if (!post) throw new CustomError(404, ResponseMessages.NOT_FOUND)

        const commented = await newComment.save();

        // Create Notification
        if (userId !== post.user.toString()) {
            const notificationData = {
                actor: userId,
                receiver: post.user.toString(),
                postId: postId,
                type: 'comment',
            }
            notificationEmitter.emit('create_notification', notificationData);
        }

        return commented
    } catch (error) {
        throw error
    }
}

const update = async ({ userId, commentId, content }: {
    userId: string,
    commentId: string,
    content: string,
}) => {
    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        if (comment.user.toString() !== userId) {
            throw new CustomError(403, ResponseMessages.FORBIDDEN);
        }

        comment.content = content;
        comment.updatedAt = new Date();

        const updatedPost = await comment.save();
        return updatedPost
    } catch (error) {
        throw error
    }
}

const deleteComment = async (commentId: string, userId: string): Promise<void> => {
    try {
        const comment = await CommentModel.findById(commentId);


        if (!comment) {
            throw new CustomError(404, ResponseMessages.NOT_FOUND);
        }

        if (comment.user.toString() !== userId) {
            throw new CustomError(403, ResponseMessages.FORBIDDEN);
        }
        await CommentModel.findByIdAndDelete(commentId);
        return
    } catch (error) {
        throw error
    }
}

const getCommentsInPost = async (postId: string) => {
    try {
        const postObjectId = new mongoose.Types.ObjectId(postId)
        return await await CommentModel.find({ post: postObjectId })
            .populate('user', '_id displayName avatar')
            .select('-post')

    } catch (error) {
        throw error
    }
}

export const commentService = {
    create,
    deleteComment,
    getCommentsInPost,
    update
}