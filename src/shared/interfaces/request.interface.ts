import { Request, Response } from 'express'
import { IUser } from '~/features/users/auth/models'

export interface IRequestAuth {
  providerId: string
}

export interface IRequest extends Request {
  auth?: IRequestAuth
  user?: IUser
}

export interface IHttpContext {
  res: Response
  req: Request
}
