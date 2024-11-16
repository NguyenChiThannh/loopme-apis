import { commentController } from '@/controllers/commentController';
import { validate } from '@/middlewares/validate';
import { verifyMiddleware } from '@/middlewares/verifyMiddleware';
import { CommentReqSchema } from '@/validations/CommentReq';
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.post('/:postId', validate(CommentReqSchema), commentController.create)
Router.route('/:id')
    .delete(commentController.deleteComment)
    .patch(validate(CommentReqSchema), commentController.update)

export const commentRoute = Router