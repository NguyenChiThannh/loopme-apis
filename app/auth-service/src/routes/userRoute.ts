import express from 'express'
import { userController } from '@/controllers/userController'
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()
Router.use(verifyMiddleware.verifyToken)
// Search user by Name
Router.get('/search', userController.searchUser)

Router.route('/')
    .patch(userController.updateUser)
    .get(userController.getMyInfo)

Router.get('/:id', userController.getUser)
export const userRoute = Router