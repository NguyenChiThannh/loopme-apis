import { commentController } from '@/controllers/commentController';
import { CommentReqSchema } from '@/validations/CommentReq';
import express from 'express'
// Common
import { validate } from '@loopme/common'
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.post('/:postId', validate(CommentReqSchema), commentController.create)
Router.route('/:id')
    .delete(commentController.deleteComment)
    .patch(validate(CommentReqSchema), commentController.update)

export const commentRoute = Router