import { channelController } from '@/controllers/channelController';
import { validate } from '@/middlewares/validate';
import { verifyMiddleware } from '@/middlewares/verifyMiddleware';
import { ChannelReqSchema } from '@/validations/ChannelReq';
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.route('/')
    .get(channelController.getAll)
    .post(validate(ChannelReqSchema), channelController.create)

Router.get('/:id', channelController.getDetail)


export const channelRoute = Router