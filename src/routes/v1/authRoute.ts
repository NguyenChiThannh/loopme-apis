import { authController } from '@/controllers/authController'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import express, { Request, Response } from 'express'

const Router = express.Router()

Router.post('/login', authController.loginUser)
Router.post('/refresh', authController.requestRefreshToken)
Router.post('/logout', verifyMiddleware.verifyToken, authController.logoutUser)

export const authRoute = Router