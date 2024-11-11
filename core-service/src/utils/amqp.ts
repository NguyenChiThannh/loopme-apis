import amqp from 'amqplib';

class RabbitMQService {
    channel;
    connection;
    exchangeName;

    constructor(exchangeName) {
        this.exchangeName = exchangeName
    }

    async createChannel() {
        if (this.channel) return

        try {
            const connectionURL = process.env.AMQP_URL
            this.connection = await amqp.connect(connectionURL)
            this.channel = await this.connection.createChannel()

            await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true })
            console.log(`Connected to exchange: ${this.exchangeName}`);
        } catch (error) {
            console.error('Failed to create channel:', error);
            setTimeout(() => this.createChannel(), 5000); // retry connection
        }
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) await this.createChannel();

        try {
            this.channel.publish(
                this.exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(message))
            );
            console.log(`Message sent to exchange "${this.exchangeName}" with routing key "${routingKey}"`);
        } catch (error) {
            console.error('Failed to publish message:', error);
        }
    }

    async consumeMessages(routingKey, onMessage) {
        if (!this.channel) await this.createChannel();

        try {
            const queue = await this.channel.assertQueue('', { exclusive: true });
            await this.channel.bindQueue(queue.queue, this.exchangeName, routingKey);

            this.channel.consume(queue.queue, (msg) => {
                if (msg?.content) {
                    onMessage(JSON.parse(msg.content.toString()));
                }
            }, { noAck: true });

            console.log(`Consuming messages from exchange "${this.exchangeName}" with routing key "${routingKey}"`);
        } catch (error) {
            console.error('Failed to consume messages:', error);
        }
    }

    async closeConnection() {
        await this.channel?.close();
        await this.connection?.close();
        console.log('RabbitMQ connection closed');
    }
}

export default RabbitMQService;