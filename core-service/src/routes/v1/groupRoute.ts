import { groupController } from "../../controllers/groupController"
import { groupMiddleware } from "../../middlewares/groupMiddleware";
import { verifyMiddleware } from "../../middlewares/verifyMiddleware"
import express from "express"

const Router = express.Router()
Router.use(verifyMiddleware.verifyToken);

Router.post('/', groupController.create)
Router.get('/:groupId', groupController.getGroupById)
Router.route('/:groupId/pending-invitations')
    .post(groupController.addPendingInvitations)
    .delete(groupMiddleware.checkGroupOwner, groupController.removePendingInvitations)

Router.post('/:groupId/accept-invitations/:userId', groupMiddleware.checkGroupOwner, groupController.acceptPendingInvitations)

Router.route('/:groupId/members/:userId')
    .post(groupMiddleware.checkGroupOwner, groupController.addMemberToGroup)
    .delete(groupMiddleware.checkGroupOwner, groupController.removeMemberFromGroup)

Router.get('/:groupId/members', groupMiddleware.checkGroupOwner, groupController.getAllMembers)
Router.get('/:groupId/invitations', groupMiddleware.checkGroupOwner, groupController.getAllPendingInvitations)

export const groupRoute = Router