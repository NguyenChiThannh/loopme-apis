import express from 'express'
import { voteController } from '@/controllers/voteController';
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.post('/upvote/:postId', voteController.upvote)
Router.post('/downvote/:postId', voteController.downvote)
Router.delete('/:postId', voteController.removevote)

export const voteRoute = Router