import { groupController } from "@/controllers/groupController"
import { verifyMiddleware } from "@/middlewares/verifyMiddleware"
import express from "express"

const Router = express.Router()

Router.post('/', verifyMiddleware.verifyToken, groupController.create)
Router.get('/:groupId', groupController.getGroup)

export const groupRoute = Router