import express from "express";
import { createServer, Server as HTTPServer } from "http";
import setupSocketIO from "@/config/socket";
import 'dotenv/config';
import redisClient from "@/config/redis";
import { consumeMessages } from "@/config/consumeMessages";

const app = express();
const httpServer: HTTPServer = createServer(app);
export const io = setupSocketIO(httpServer);

// app.get('/', (req, res) => {
//     res.send('Hello')
// })

httpServer.listen(process.env.PORT, () => {
    console.log(`Realtime service is running on port: ${process.env.PORT}`);
});

const handleRealtime = async () => {
    await consumeMessages()
}

handleRealtime()
