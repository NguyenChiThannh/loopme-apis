import { friendRoute } from '@/routes/friendRoute'
import express from 'express'

const Router = express.Router()

// Friend api
Router.use('/friends', friendRoute)

export const APIs_V1 = Router
