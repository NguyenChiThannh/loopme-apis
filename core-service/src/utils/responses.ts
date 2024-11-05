import Logger from "@/utils/amqp";
import type { Response } from "express";

interface reponsePrams {
    res: Response,
    message: string,
    status: number,
    data?: any,
}

const logger = new Logger();
export function successResponse({ res, message, status, data }: reponsePrams) {
    // logger.publishMessage("Info", {
    //     status,
    //     message
    // })
    return res.status(status).json({ success: true, message, data: data });
}

export function errorResponse({ res, message, status }: reponsePrams) {
    return res.status(status).json({ success: false, message });
}
