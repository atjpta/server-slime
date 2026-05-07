import { env } from "@/configs/env.config.js";
import { RedisDriver } from "colyseus";
import { createClient } from "redis";

function connectRedis() {
    try {
        const redis = createClient({
            url: env.REDIS_URI,
        });
        console.log(`[Redis] Connected: ${env.REDIS_URI}`);
        return redis;
    } catch (err) {
        console.error("[Redis] Connection failed:", err);
        process.exit(1);
    }
}

function connectRedisDriver() {
    try {
        const redis = new RedisDriver(env.REDIS_URI);
        console.log(`[RedisDriver] Connected: ${env.REDIS_URI}`);
        return redis;
    } catch (err) {
        console.error("[RedisDriver] Connection failed:", err);
        process.exit(1);
    }
}

export const redis = connectRedis();
export const redisDriver = connectRedisDriver();
