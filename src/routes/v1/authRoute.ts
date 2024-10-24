import { authController } from '@/controllers/authController'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import { LoginReqSchema, RegisterReqSchema } from '@/validations/AuthReq'
import express from 'express'

const Router = express.Router()

Router.post('/register', validate(RegisterReqSchema), authController.registerUser)
Router.post('/verify-account', authController.verifyAccount)
Router.post('/login', validate(LoginReqSchema), authController.loginUser)
Router.post('/refresh-token', authController.requestRefreshToken)
Router.post('/logout', verifyMiddleware.verifyToken, authController.logoutUser)
Router.post('/forgot-password', authController.forgotPassword)
Router.post('/verify-forgot-password', authController.verifyForgotPassword)

export const authRoute = Router