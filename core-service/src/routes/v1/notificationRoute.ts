import express from "express"
import { notificationController } from "@/controllers/notificationController";
// Common
import { verifyMiddleware } from '@loopme/common'

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.get('/', notificationController.getAll)
Router.patch('/:id/read', notificationController.markAsRead);
Router.patch('/read', notificationController.markAllAsRead);


export const notificationRoute = Router