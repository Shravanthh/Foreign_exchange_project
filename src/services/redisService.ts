import { createClient, RedisClientType } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const REDIS_PORT = process.env.REDIS_PORT!

const redisClient: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(REDIS_PORT)
    }
});

export const setSessionToken = async (sessionId: string)=> {
    try {
        await redisClient.connect().then(() => redisClient.set('sessionToken', sessionId))
        console.log('Session token set successfully');
    } catch (error) {
        console.error('Error setting session token:', error);
    }
}