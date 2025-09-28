import { JWT, JwtPayload } from '@colyseus/auth'
import { logger, Room } from '@colyseus/core'
import { IUser, UserModel } from '~/features/users/auth/models'
import { Schema } from '@colyseus/schema'

export class BaseRoom<T extends Schema> extends Room<T, any, IUser, IUser> {
  static async onAuth(token: string) {
    const jwtPayload = (await JWT.verify(token)) as JwtPayload
    const providerId = jwtPayload.providerId
    const user = await UserModel.findOne({ providerId })
    return user
  }

  onUncaughtException(err: Error, methodName: string) {
    logger.error('An error occurred in', methodName, ':', err)
  }
}
