import amqp from 'amqplib'
class Logger {
    channel;

    async createChannel() {
        const connection = await amqp.connect(process.env.AMQP_PORT);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }

        const exchangeName = process.env.ExchangeName
        await this.channel.assertExchange(exchangeName, "direct");

        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message))
        );
    }
}

export default Logger