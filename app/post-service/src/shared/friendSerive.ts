import { FriendModel } from '@loopme/common'

const getFriendIds = async (userObjectId) => {
    const friendIdsResult = await FriendModel.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { sender: userObjectId },
                            { receiver: userObjectId }
                        ]
                    },
                    {
                        status: "accepted"
                    }
                ]
            }
        },
        {
            $project: {
                userId: {
                    $cond: {
                        if: { $eq: ["$sender", userObjectId] },
                        then: "$receiver",
                        else: "$sender"
                    }
                },
                _id: 0
            }
        },
        {
            $group: {
                _id: null,
                friendIds: { $push: "$userId" }
            }
        },
        {
            $project: {
                _id: 0,
                friendIds: 1
            }
        }
    ])
    const friendIds = friendIdsResult.length > 0 ? friendIdsResult[0].friendIds : [];
    return friendIds
}

export const friendService = {
    getFriendIds,
}