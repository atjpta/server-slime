import { RedisDriver } from '@colyseus/redis-driver'

const redis = new RedisDriver()
redis.clear()

export const DiverCache = redis
