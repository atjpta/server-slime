import { JWT, JwtPayload } from '@colyseus/auth'
import { NextFunction, Response } from 'express'
import { UserModel } from '../models'
import ResponseHelper from '~/core/helpers/response.helper'
import { ApiErrorCodeEnum } from '~/shared/enums'
import { IRequest } from '~/shared/interfaces'

export const authMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer', '').trim()
  try {
    const jwtPayload = (await JWT.verify(token)) as JwtPayload
    const providerId = jwtPayload.providerId
    const record = await UserModel.findOne({
      providerId,
    })

    if (!record) {
      throw new Error('user not found')
    }
    req['user'] = record
    return next()
  } catch (error: any) {
    return ResponseHelper.unauthorized(
      { res, req },
      {
        code: ApiErrorCodeEnum.UNAUTHORIZED,
        error: error.message,
      }
    )
  }
}
