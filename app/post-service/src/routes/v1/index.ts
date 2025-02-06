import { postRoute } from '@/routes/v1/postRoute'
import express from 'express'

const Router = express.Router()

// Post api
Router.use('/posts', postRoute)

export const APIs_V1 = Router
