import redisClient from '@/config/redis';
import { io } from '@/index';
import amqp from 'amqplib'

export const consumeMessages = async () => {
    const connection = await amqp.connect(process.env.AMQP_PORT);
    const channel = await connection.createChannel();

    await channel.assertExchange(process.env.ExchangeName, "direct");

    await channel.assertQueue("MessageQueue");
    await channel.assertQueue("NotificationsQueue");

    await channel.bindQueue("MessageQueue", process.env.ExchangeName, "Message");
    await channel.bindQueue("NotificationsQueue", process.env.ExchangeName, "Notifications");

    channel.consume("MessageQueue", async (msg) => {
        const message = JSON.parse(msg.content);
        const socketId = await redisClient.get(`${message.receiver}`)
        if (socketId)
            io.to(socketId).emit('message', message)
        channel.ack(msg);
    });

    channel.consume("NotificationsQueue", async (msg) => {
        const message = JSON.parse(msg.content);
        const socketId = await redisClient.get(`${message.receiver}`)
        if (socketId)
            io.to(socketId).emit('notifications', message)
        channel.ack(msg);
    });
}