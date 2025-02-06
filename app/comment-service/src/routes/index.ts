import { commentRoute } from '@/routes/commentRoute'
import express from 'express'

const Router = express.Router()

// Comment api
Router.use('/comments', commentRoute)

export const APIs_V1 = Router
