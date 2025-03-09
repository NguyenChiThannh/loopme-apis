import express from "express";
import { createServer, Server as HTTPServer } from "http";
import setupSocketIO from "@/config/socket";
import "dotenv/config";
import { consumeMessages } from "@/config/consumeMessages";

const app = express();
const httpServer: HTTPServer = createServer(app);
export const io = setupSocketIO(httpServer);

httpServer.listen(Number(process.env.APP_PORT), process.env.APP_HOST, () => {
  console.log(`Realtime service is running on port: ${process.env.PORT}`);
});

const handleRealtime = async () => {
  await consumeMessages();
};

handleRealtime();
