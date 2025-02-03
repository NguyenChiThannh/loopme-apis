import express from 'express'
import { otpController } from '../../controllers/otpController'

const Router = express.Router()

Router.post('/refresh', otpController.refreshOTP)

export const otpRoute = Router