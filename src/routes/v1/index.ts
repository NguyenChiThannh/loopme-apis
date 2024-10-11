import { authRoute } from '@/routes/v1/authRoute'
import express, { Request, Response } from 'express'

const Router = express.Router()

Router.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello world' })
})


// Auth api
Router.use('/auth', authRoute)

// User api
// Router.use('/user', userRoute)

// otp api
// Router.use('/otp', otpRoute)

export const APIs_V1 = Router
