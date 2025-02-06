import express from 'express'
import { voteRoute } from '@/routes/v1/voteRoute'

const Router = express.Router()

// Vote api
Router.use('/votes', voteRoute)

export const APIs_V1 = Router
