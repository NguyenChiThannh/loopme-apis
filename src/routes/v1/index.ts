import { authRoute } from '@/routes/v1/authRoute'
import { groupRoute } from '@/routes/v1/groupRoute'
import { otpRoute } from '@/routes/v1/otpRoute'
import { postRoute } from '@/routes/v1/postRoute'
import express, { Request, Response } from 'express'

const Router = express.Router()

Router.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello world' })
})

// Auth api
Router.use('/auth', authRoute)

// User api
// Router.use('/user', userRoute)

// OTP api
Router.use('/otp', otpRoute)

// Post api
Router.use('/post', postRoute)

// Post api
Router.use('/group', groupRoute)

export const APIs_V1 = Router
