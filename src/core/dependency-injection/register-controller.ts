import e, { RequestHandler, Router } from 'express'
import { DIContainer } from './container'
import { HttpMethodEnum } from '~/shared/enums'
import { asyncWrapper } from './async-wrapper'

interface ControllerInstance {
  prefix?: string
  routes?: {
    method: HttpMethodEnum
    path: string
    middlewares?: RequestHandler[]
    handlerName: string
  }[]
  [key: string]: any
}

export function registerControllers(app: e.Application, controllerClass: any) {
  for (const controllerClassRaw of controllerClass) {
    const controllerClass = DIContainer.resolve(
      controllerClassRaw
    ) as ControllerInstance
    registerController(app, controllerClass)
  }
}

export function registerController(
  app: e.Application,
  controllerClass: ControllerInstance
) {
  const instance = controllerClass
  const prefix = instance.prefix || ''
  const router = Router()

  instance.routes?.forEach((r) => {
    const handler = instance[r.handlerName].bind(instance)
    const middlewares = r.middlewares
    router[r.method](r.path, ...middlewares, asyncWrapper(handler))
  })

  app.use(prefix, router)
}
