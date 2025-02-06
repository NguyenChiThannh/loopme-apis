import { authController } from '@/controllers/authController'
import { ChangePasswordReqSchema, RegisterReqSchema } from '@/validations/AuthReq'
import express from 'express'
// Common
import { validate } from '@loopme/common'
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.post('/register', validate(RegisterReqSchema), authController.registerUser)
Router.post('/verify-account', authController.verifyAccount)

// Router.post('/login', validate(LoginReqSchema), authController.loginUser)
Router.post('/login', authController.loginUser)

Router.post('/refresh-token', authController.requestRefreshToken)

Router.post('/logout', verifyMiddleware.verifyToken, authController.logoutUser)

Router.put('/change-pwd', validate(ChangePasswordReqSchema), verifyMiddleware.verifyToken, authController.changePassword)

Router.post('/forgot-password', authController.forgotPassword)
Router.post('/verify-forgot-password', authController.verifyForgotPassword)

export const authRoute = Router