import express from 'express'
import { postController } from '../../controllers/postController'
import { groupMiddleware } from '../../middlewares/groupMiddleware'
import { PostReqSchema } from '../../validations/PostReq'
// Common
import { validate } from '@loopme/common'
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.route('/')
    .post(validate(PostReqSchema), postController.create)
    .get(postController.getPosts)

// Get detail post by Id
Router.route('/:id')
    .get(postController.getById)
    .delete(verifyMiddleware.verifyToken, postController.deleteById)
    .patch(verifyMiddleware.verifyToken, postController.updateById)

// Get all post in userProfile by userInfo
Router.get('/user/:userId', postController.getPostsByUserId)

// Get all post in group by groupId
Router.get('/group/:groupId', postController.getPostsByGroupId)
// Create post in group
Router.post('/group', groupMiddleware.checkGroupMembership, validate(PostReqSchema), postController.create)

export const postRoute = Router