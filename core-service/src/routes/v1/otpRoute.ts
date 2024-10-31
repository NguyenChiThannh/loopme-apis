import { otpController } from '../../controllers/otpController'
import express from 'express'

const Router = express.Router()

Router.post('/refresh', otpController.refreshOTP)

export const otpRoute = Router