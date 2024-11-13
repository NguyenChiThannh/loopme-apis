import { messageController } from '@/controllers/messageController'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import { MessageReqSchema } from '@/validations/MessageReq'
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken)

Router.get('/', messageController.getAll)
Router.post('/:userId', validate(MessageReqSchema), messageController.send)


export const messageRoute = Router