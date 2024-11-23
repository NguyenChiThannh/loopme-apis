import { memberController } from '@/controllers/memberController'
import { validate } from '@/middlewares/validate'
import { verifyMiddleware } from '@/middlewares/verifyMiddleware'
import express from 'express'

const Router = express.Router()

Router.use(verifyMiddleware.verifyTokenAndAdminAuth)

Router.route('/')
    .get(memberController.getMembersInGroup)
    .delete(memberController.deleteMemberFromGroup)

export const memberRoute = Router