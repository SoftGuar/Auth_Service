import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis(): Promise<void> {
  await redisClient.connect();
  console.log('Redis connected');
}

export async function setToken(key: string, token: string, expirationInSec?: number): Promise<void> {
  if (expirationInSec) {
    await redisClient.set(key, token, { EX: expirationInSec });
  } else {
    await redisClient.set(key, token);
  }
}

export async function getToken(key: string): Promise<string | null> {
  return await redisClient.get(key);
}

export async function deleteToken(key: string): Promise<void> {
  await redisClient.del(key);
}