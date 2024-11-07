import { userController } from '@/controllers/userController'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import express from 'express'

const Router = express.Router()
Router.use(verifyMiddleware.verifyToken)
// Search user by Name
Router.get('/search', userController.searchUser)

Router.route('/')
    .patch(userController.updateUser)
    .get(userController.getMyInfo)

Router.get('/:id', userController.getUser)
export const userRoute = Router