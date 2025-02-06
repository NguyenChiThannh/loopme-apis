
import { notificationService } from '@/services/notificationService';
import { ENV_Common } from '@loopme/common';
import amqp from 'amqplib'

export const consumeMessages = async () => {
    const connection = await amqp.connect(ENV_Common.AMQP_PORT);
    const channel = await connection.createChannel();

    await channel.assertExchange(ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE, "direct");

    await channel.assertQueue("NotificationsQueue");

    await channel.bindQueue("NotificationsQueue", ENV_Common.EXCHANGENAME_NOTIFICATION_SERVICE, "Notification");


    channel.consume("NotificationsQueue", async (msg) => {
        const message = JSON.parse(msg.content);
        console.log('🚀 ~ channel.consume ~ message:', message)
        notificationService.create(message)
        channel.ack(msg);
    });
}