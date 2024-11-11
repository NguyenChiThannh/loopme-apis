import { notificationController } from "@/controllers/notificationController";
import { verifyMiddleware } from "@/middlewares/verifyMiddleware";
import express from "express"

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.get('/', notificationController.getAll)
Router.patch('/:id/read', notificationController.markAsRead);
Router.patch('/read', notificationController.markAllAsRead);


export const notificationRoute = Router