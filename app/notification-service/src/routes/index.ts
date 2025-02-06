import { notificationRoute } from '@/routes/notificationRoute'
import express from 'express'

const Router = express.Router()

// Notification api
Router.use('/notifications', notificationRoute)

export const APIs_V1 = Router
