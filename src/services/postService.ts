import mongoose from 'mongoose';
import PostModel from "@/models/post"

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

const upvote = async (postId, userId) => {
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

        // // Kiểm tra xem post có tồn tại và votes có phải là mảng không
        // if (post && Array.isArray(post.votes)) {
        //     const userVoteIndex = post.votes.findIndex(vote => vote.userId.equals(userId));

        //     if (userVoteIndex > -1) {
        //         // Nếu đã có bình chọn, cập nhật giá trị
        //         post.votes[userVoteIndex].value = 'UPVOTE';
        //     } else {
        //         // Nếu chưa có, thêm vào mảng
        //         post.votes.push({ userId: new mongoose.Types.ObjectId(userId), value: 'UPVOTE' });
        //     }

        //     await post.save(); // Lưu thay đổi
        // } else {
        //     console.log('Post không tồn tại hoặc votes không phải là mảng');
        // }
        // // Kiểm tra dữ liệu vừa cập nhật
        // console.log('🚀 ~ upvote ~ data:', post);
        return
    } catch (error) {
        throw error
    }
}

const downvote = async (postId, userId) => {
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

const removevote = async (postId, userId) => {
    try {
        console.log('🚀 ~ removevote ~ userId:', userId)
        const postObjectId = new mongoose.Types.ObjectId(postId)
        const userObjectId = new mongoose.Types.ObjectId(userId)
        await PostModel.updateOne(
            { _id: postObjectId },
            {
                $pull: { votes: { userId: userObjectId } }
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