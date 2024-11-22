import { messageController } from '@/controllers/messageController'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import { MessageReqSchema } from '@/validations/MessageReq'
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyTokenAndAdminAuth)

Router.get('/', messageController.getAll)
Router.post('/send/:userId', validate(MessageReqSchema), messageController.send)
Router.route('/:id')
    .patch(validate(MessageReqSchema), messageController.update)
    .delete(messageController.deleteMessage)


export const messageRoute = Router