import { friendController } from "@/controllers/friendController";
import express from "express"
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.route('/pending-invitations/:userId')
    .post(friendController.addPendingInvitations)
    .delete(friendController.removePendingInvitations)

Router.get('/', friendController.getAllFriend)

Router.post('/accept-invitations/:userId', friendController.acceptInvitations)

Router.delete('/:userId', friendController.removeFriend)

Router.get('/all-invitations', friendController.getAllInvitationsFriend)
//Get 4 random users who are not friends or have not sent a friend request.
Router.get('/suggest-mutual-friends', friendController.suggestMutualFriends)

export const friendRoute = Router