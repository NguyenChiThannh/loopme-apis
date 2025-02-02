import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQService {
    private channel: Channel | null = null;
    private connection: Connection | null = null;
    private readonly exchangeName: string;

    constructor(exchangeName: string) {
        this.exchangeName = exchangeName;
    }

    async createChannel(): Promise<void> {
        if (this.channel) return

        try {
            const connectionURL = process.env.AMQP_URL as string
            this.connection = await amqp.connect(connectionURL)
            this.channel = await this.connection.createChannel()

            await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true })
            console.log(`Connected to exchange: ${this.exchangeName}`);
        } catch (error) {
            console.error('Failed to create channel:', error);
            setTimeout(() => this.createChannel(), 5000); // retry connection
        }
    }

    async publishMessage(routingKey: string, message: unknown): Promise<void> {
        if (!this.channel) await this.createChannel();

        if (!this.channel) {
            console.error('Channel is not available. Message not sent.');
            return;
        }

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

    async consumeMessages(routingKey: string, onMessage: (msg: any) => void): Promise<void> {
        if (!this.channel) await this.createChannel();

        if (!this.channel) {
            console.error('Channel is not available. Message not sent.');
            return;
        }

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

    async closeConnection(): Promise<void> {
        try {
            await this.channel?.close();
            await this.connection?.close();
            console.log('RabbitMQ connection closed');
        } catch (error) {
            console.error('Failed to close RabbitMQ connection:', error);
        } finally {
            this.channel = null;
            this.connection = null;
        }
    }
}

export default RabbitMQService;