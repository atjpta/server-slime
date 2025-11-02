import e, { NextFunction, Request, Response, Router } from 'express'
import { playground } from '@colyseus/playground'
import { monitor } from '@colyseus/monitor'
import { basicAuthMiddleware } from '~/middlewares'
import { AuthService } from '~/features/users/auth/services'
import { registerControllers } from '~/core/dependency-injection'
import {
  AuthController,
  DiscordController,
} from '~/features/users/auth/controllers'
import { PlayerController } from '~/features/players/controllers'

const router = Router()

if (process.env.NODE_ENV !== 'production') {
  router.use('/', playground())
} else {
  router.get('/', (_, res) => {
    return res.send('ok')
  })
}

router.use('/monitor', basicAuthMiddleware, monitor())

export const appRouter = (app: e.Express) => {
  app.use(AuthService.prefix, AuthService.routes())

  registerControllers(app, [
    DiscordController,
    AuthController,
    PlayerController,
  ])

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      console.error(err)
      return res
        .status(err.status || 500)
        .send({ error: err.message || 'Internal Error', url: req.url })
    }
    next()
  })
  app.use(router)
}
