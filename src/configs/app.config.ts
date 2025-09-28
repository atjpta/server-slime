import config from '@colyseus/tools'
import { appRouter, gameServerRouter } from '~/routers'
import { connectMongoDB } from './database.config'
import { DiverCache } from './diver.config'
import { RedisPresence } from '@colyseus/redis-presence'
import { env } from './env.config'

export const appConfig = config({
  options: {
    driver: DiverCache,
    presence: new RedisPresence(env.REDIS_URI),
  },

  initializeGameServer: (gameServer) => {
    gameServerRouter(gameServer)
    gameServer.onBeforeShutdown(() => {
      console.log('onBeforeShutdown')
    })
  },

  initializeExpress: (app) => {
    appRouter(app)
  },

  beforeListen: async () => {
    await connectMongoDB()
  },
})
