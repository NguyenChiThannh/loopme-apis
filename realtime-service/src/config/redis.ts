import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
    url: "redis://localhost:6379",
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

async function connectRedis(): Promise<void> {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

connectRedis();

export default redisClient;