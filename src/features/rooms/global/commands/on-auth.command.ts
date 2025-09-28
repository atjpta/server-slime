import { Command } from '@colyseus/command'
import { GlobalRoom } from '../global.room'
import { Client } from '@colyseus/core'
import { IUser, UserModel } from '~/features/users/auth/models'
import { DateTime } from 'luxon'
import { ErrorCodeEnum } from '~/shared/enums'

interface IProps {
  client: Client<IUser, IUser>
  clients: Client<IUser, IUser>[]
}

export default class OnAuthCommand extends Command<GlobalRoom, IProps> {
  async execute({ client, clients }: IProps) {
    await UserModel.updateOne(
      { providerId: client.auth.providerId },
      { lastLogin: DateTime.now() }
    )
    const oldClients = clients.filter(
      (e) =>
        e.auth.providerId === client.auth.providerId &&
        e.sessionId !== client.sessionId
    )
    oldClients.forEach((oldClient) => {
      oldClient.leave(ErrorCodeEnum.LOGGED_IN_OTHER_DEVICE)
    })
  }
}
