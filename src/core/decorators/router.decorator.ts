import { RequestHandler } from 'express'
import { httpMethodEnum } from '~/shared/enums'

export function Route(
  method: httpMethodEnum,
  path: string,
  ...middlewares: RequestHandler[]
) {
  return function (target: any, propertyKey: string) {
    if (!target.routes) target.routes = []
    target.routes.push({
      method,
      path,
      middlewares,
      handlerName: propertyKey,
    })
  }
}
