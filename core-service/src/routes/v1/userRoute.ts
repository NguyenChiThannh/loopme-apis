import { userController } from '@/controllers/userController'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import express from 'express'

const Router = express.Router()
Router.use(verifyMiddleware.verifyToken)
// Search user by Name
Router.get('/search', userController.searchUser)

Router.route('/')
    .post(userController.updateUser)
    .get(userController.getUser)

export const userRoute = Router