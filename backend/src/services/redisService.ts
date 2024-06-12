import dotenv from "dotenv";
import {createClient, RedisClientType} from "redis";


dotenv.config();

const REDIS_PORT = process.env.REDIS_PORT!

const redisClient: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(REDIS_PORT)
    }
});

export const setSessionToken = async (sessionId: string, expiresAt: number)=> {
    try {
        if(await redisClient.connect()){
            await redisClient.set(sessionId, expiresAt)
        }else {
            await redisClient.connect().then(() => redisClient.set(sessionId, expiresAt))
        }
        console.log('Session token set successfully');
    } catch (error) {
        console.error('Error setting session token:', error);
    }
}

export const getSessionToken = async (sessionId: string): Promise<string | undefined | null> => {
    try {
        if(await redisClient.connect()){
        }else {
            return await redisClient.connect().then(() => redisClient.get(sessionId))
        }
    } catch (error) {
        console.error('Error fetching sessionId', error)
    }
}