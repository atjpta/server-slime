import config from '@colyseus/tools'
import { appRouter, gameServerRouter } from '~/routers'
import { connectRedis } from './diver.config'
import { connectMongoDB } from './database.config'

export const appConfig = config({
  options: {
    driver: connectRedis(),
  },

  initializeGameServer: (gameServer) => {
    gameServerRouter(gameServer)
  },

  initializeExpress: (app) => {
    app.use(appRouter)
  },

  beforeListen: async () => {
    await connectMongoDB()
  },
})
