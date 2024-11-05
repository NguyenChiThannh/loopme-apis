import { notificationController } from "@/controllers/notificationController";
import { verifyMiddleware } from "@/middlewares/verifyMiddleware";
import express from "express"

const Router = express.Router()

Router.use(verifyMiddleware.verifyToken);

Router.get('/', notificationController.getAll)

export const notificationRoute = Router