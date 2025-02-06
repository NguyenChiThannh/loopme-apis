import { channelController } from '@/controllers/channelController';
import { ChannelReqSchema } from '@/validations/ChannelReq';
import express from 'express'
// Common
import { validate } from '@loopme/common'
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.route('/')
    .get(channelController.getAll)
    .post(validate(ChannelReqSchema), channelController.create)

Router.get('/:id', channelController.getDetail)

export const channelRoute = Router