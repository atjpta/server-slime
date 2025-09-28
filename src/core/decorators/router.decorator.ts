import { RequestHandler } from 'express'
import { HttpMethodEnum } from '~/shared/enums'

export function Route(
  method: HttpMethodEnum,
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
