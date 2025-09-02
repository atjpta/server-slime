import config from '@colyseus/tools'
import { appRouter, gameServerRouter } from '~/routers'
import { connectMongoDB } from './database.config'
import { DiverCache } from './diver.config'

export const appConfig = config({
  options: {
    driver: DiverCache,
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
