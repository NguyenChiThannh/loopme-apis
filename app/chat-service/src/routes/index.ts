import { channelRoute } from '@/routes/channelRoute'
import { messageRoute } from '@/routes/messageRoute'
import express from 'express'

const Router = express.Router()

// Channel api
Router.use('/channels', channelRoute)

// Message api
Router.use('/messages', messageRoute)

export const APIs_V1 = Router
