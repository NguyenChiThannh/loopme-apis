import amqp from 'amqplib'
import { logError } from './logger.js';

export const consumeMessages = async () => {
    const connection = await amqp.connect(process.env.AMQP_PORT);
    const channel = await connection.createChannel();

    await channel.assertExchange(process.env.ExchangeName, "direct");

    const q = await channel.assertQueue("ErrorQueue");

    await channel.bindQueue(q.queue, process.env.ExchangeName, "Error");

    await channel.consume(q.queue, (msg) => {
        const message = JSON.parse(msg.content);
        logError(message)
        channel.ack(msg);
    });
}
