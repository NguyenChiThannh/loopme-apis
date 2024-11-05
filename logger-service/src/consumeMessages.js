import amqp from 'amqplib'
import { logError, logInfo } from './logger.js';

export const consumeMessages = async () => {
    const connection = await amqp.connect(process.env.AMQP_PORT);
    const channel = await connection.createChannel();

    await channel.assertExchange(process.env.ExchangeName, "direct");

    await channel.assertQueue("ErrorQueue");
    await channel.assertQueue("InfoQueue");

    await channel.bindQueue("ErrorQueue", process.env.ExchangeName, "Error");
    await channel.bindQueue("InfoQueue", process.env.ExchangeName, "Info");

    channel.consume("ErrorQueue", (msg) => {
        const message = JSON.parse(msg.content);
        console.log('🚀 ~ channel.consume ~ message:', message)
        logError(message);
        channel.ack(msg);
    });

    channel.consume("InfoQueue", (msg) => {
        const message = JSON.parse(msg.content);
        console.log('🚀 ~ channel.consume ~ message:', message)
        logInfo(message);
        channel.ack(msg);
    });
}