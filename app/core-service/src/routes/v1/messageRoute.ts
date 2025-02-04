import express from 'express'
import { messageController } from '@/controllers/messageController'
import { MessageReqSchema } from '@/validations/MessageReq'
// Common
import { validate } from '@loopme/common'
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken)

Router.get('/', messageController.getAll)
Router.post('/send/:userId', validate(MessageReqSchema), messageController.send)
Router.route('/:id')
    .patch(validate(MessageReqSchema), messageController.update)
    .delete(messageController.deleteMessage)


export const messageRoute = Router