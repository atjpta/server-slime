import { Router } from 'express'
import { playground } from '@colyseus/playground'
import { monitor } from '@colyseus/monitor'
import { basicAuthMiddleware } from '~/middlewares'

const router = Router()

if (process.env.NODE_ENV !== 'production') {
  router.use('/', playground())
}

router.use('/monitor', basicAuthMiddleware, monitor())

export const appRouter = router
