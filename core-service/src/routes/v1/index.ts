import Logger from '@/utils/amqp'
import { authRoute } from './authRoute'
import { friendRoute } from './friendRoute'
import { groupRoute } from './groupRoute'
import { otpRoute } from './otpRoute'
import { postRoute } from './postRoute'
import express, { Request, Response } from 'express'
import { userRoute } from '@/routes/v1/userRoute'
import { messageRoute } from '@/routes/v1/messageRoute'
import { notificationRoute } from '@/routes/v1/notificationRoute'

const logger = new Logger();
const Router = express.Router()

Router.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello world' })
})


Router.get('/test-error-logger', (req: Request, res: Response) => {
    logger.publishMessage("Error", {
        message: 'Test Internal Server Error',
        stack: 'Error in line test'
    })
    res.status(200).json({ message: 'Success' })
})

// Auth api
Router.use('/auth', authRoute)

// User api
Router.use('/user', userRoute)

// OTP api
Router.use('/otps', otpRoute)

// Post api
Router.use('/posts', postRoute)

// Post api
Router.use('/groups', groupRoute)

// Friend api
Router.use('/friends', friendRoute)

// Message api
Router.use('/messages', messageRoute)

// Notification api
Router.use('/notifications', notificationRoute)

export const APIs_V1 = Router
