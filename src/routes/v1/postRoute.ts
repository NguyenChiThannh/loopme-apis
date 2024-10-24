import { postController } from '@/controllers/postController'
import { groupMiddleware } from '@/middlewares/groupMiddleware'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import { PostReqSchema } from '@/validations/PostReq'
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);
Router.post('/', validate(PostReqSchema), postController.create)
Router.post('/group', groupMiddleware.checkGroupMembership, validate(PostReqSchema), postController.create)
Router.post('/:id/upvote', validate(PostReqSchema), postController.upvote)
Router.post('/:id/downvote', validate(PostReqSchema), postController.downvote)
Router.delete('/:id/removevote', validate(PostReqSchema), postController.removevote)
export const postRoute = Router