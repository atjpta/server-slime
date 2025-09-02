import { NextFunction, Request, RequestHandler, Response } from 'express'

export const asyncWrapper = (handler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}
