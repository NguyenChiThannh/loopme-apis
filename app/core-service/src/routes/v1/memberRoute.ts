import express from 'express'
import { memberController } from '@/controllers/memberController'
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyTokenAndAdminAuth)

Router.route('/')
    .get(memberController.getMembersInGroup)
    .delete(memberController.deleteMemberFromGroup)

export const memberRoute = Router