import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { corsOptions } from "@/config/cor";
import redisClient from "../config/redis";

function setupSocketIO(httpServer: HTTPServer): Server {
    const io = new Server(httpServer, {
        cors: corsOptions
    });

    io.on("connection", async (socket: Socket) => {
        console.log(`New client connected: ${socket.id}`);
        const userId = socket.handshake.query.userId
        console.log('🚀 ~ io.on ~ userId:', userId)
        if (userId) {
            await redisClient.set(`${userId}`, socket.id);
        }
        socket.on("disconnect", async () => {
            console.log(`Client disconnected: ${socket.id}`);
            await redisClient.del(`${userId}`);
        });
    });

    return io;
}

export default setupSocketIO;
