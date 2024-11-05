import { messageController } from '@/controllers/messageController'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import { MessageReqSchema } from '@/validations/MessageReq'
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken)

Router.route('/:userId')
    .get(validate(MessageReqSchema), messageController.getAll)
    .post(messageController.send)

export const messageRoute = Router