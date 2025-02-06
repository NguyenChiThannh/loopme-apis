import { groupRoute } from '@/routes/groupRoute'
import express from 'express'

const Router = express.Router()

// Group api
Router.use('/groups', groupRoute)

export const APIs_V1 = Router
