import { verifyMiddleware } from "@/middlewares/verifyMiddleware";
import { friendController } from "../../controllers/friendController"
import express from "express"
const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.route('/pending-invitations/:userId')
    .post(friendController.addPendingInvitations)
    .delete(friendController.removePendingInvitations)

Router.get('/', friendController.getAllFriend)
Router.post('/accept-invitations/:userId', friendController.acceptInvitations)
Router.delete('/:userId', friendController.removeFriend)
Router.get('/all-invitations', friendController.getAllInvitationsFriend)
Router.get('/suggest-mutual-friends', friendController.suggestMutualFriends)

export const friendRoute = Router