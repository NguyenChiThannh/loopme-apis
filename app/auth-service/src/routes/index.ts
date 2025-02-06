import { authRoute } from '@/routes/authRoute'
import { otpRoute } from '@/routes/otpRoute'
import { userRoute } from '@/routes/userRoute'
import express from 'express'

const Router = express.Router()

// Auth api
Router.use('/auth', authRoute)

// User api
Router.use('/user', userRoute)

// OTP api
Router.use('/otps', otpRoute)

export const APIs_V1 = Router
