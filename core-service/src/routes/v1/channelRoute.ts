import { channelController } from '@/controllers/channelController';
import { verifyMiddleware } from '@/middlewares/verifyMiddleware';
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.get('/', channelController.getAll)
Router.get('/:id', channelController.getDetail)

export const channelRoute = Router