import { Command } from '@colyseus/command'
import { GlobalRoom } from '../global.room'
import { Client } from '@colyseus/core'
import { IUser } from '~/features/users/auth/models'

interface IProps {
  client: Client<IUser, IUser>
}

export default class OnJoinCommand extends Command<GlobalRoom, IProps> {
  async execute({ client }: IProps) {
    client.send('alert', { key: 'welcome' })
  }
}
