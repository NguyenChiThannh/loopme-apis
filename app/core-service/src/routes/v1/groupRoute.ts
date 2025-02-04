import express from "express"
import { groupController } from "../../controllers/groupController"
import { groupMiddleware } from "../../middlewares/groupMiddleware";
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken)

Router.route('/')
    .post(groupController.create)
    .get(groupController.getJoinedGroup)
// Search group by Name
Router.get('/search', groupController.searchGroups)

Router.get('/:groupId', groupController.getGroupById)
Router.delete('/:groupId', groupMiddleware.checkGroupOwner, groupController.deleteGroupById)

Router.post('/:groupId/pending-invitations', groupController.addPendingInvitations)

Router.delete('/:groupId/pending-invitations/:userId', groupController.removePendingInvitations)

Router.post('/:groupId/accept-invitations/:userId', groupMiddleware.checkGroupOwner, groupController.acceptPendingInvitations)

Router.route('/:groupId/members/:userId')
    .post(groupMiddleware.checkGroupOwner, groupController.addMemberToGroup)
    .delete(groupMiddleware.checkGroupOwner, groupController.removeMemberFromGroup)

Router.get('/:groupId/members', groupController.getAllMembers)

Router.get('/:groupId/invitations', groupMiddleware.checkGroupOwner, groupController.getAllPendingInvitations)

export const groupRoute = Router