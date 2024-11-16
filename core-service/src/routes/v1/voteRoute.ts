import { voteController } from '@/controllers/voteController';
import { verifyMiddleware } from '@/middlewares/verifyMiddleware';
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.post('/upvote/:postId', voteController.upvote)
Router.post('/downvote/:postId', voteController.downvote)
Router.delete('/:postId', voteController.removevote)

export const voteRoute = Router