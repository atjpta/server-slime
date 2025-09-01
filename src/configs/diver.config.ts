import { RedisDriver } from 'colyseus'

export const connectRedis = () => {
  return new RedisDriver()
}
