import CommentModel from "@/models/comment";
import mongoose from "mongoose";
import { CustomError, ENV_Common, RabbitMQService } from "@loopme/common";
import { ResponseMessages } from "@loopme/common";
import { transport } from "@/transport";

const create = async ({ userId, postId, content, accessToken }: {
    userId: string,
    postId: string,
    content: string,
    accessToken: string
}) => {
    try {
        const newComment = new CommentModel({
            user: userId,
            post: postId,
            content: content,
        });

        const post = await transport.getPost(postId, accessToken)

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

            // Pub message to the notification service  

            const notificationMessage = new RabbitMQService(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE)

            notificationMessage.publishMessage("Notification", notificationData)
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