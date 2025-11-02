import { Client } from '@colyseus/core'
import { IUser } from '~/features/users/auth/models'
import { BaseRoom } from '~/core/rooms/base-room'
import { Dispatcher } from '@colyseus/command'
import { TournamentState } from '~/features/rooms/battles/tournament/schema/tournament.state'

export class TournamentRoom extends BaseRoom<TournamentState> {
  state = new TournamentState()
  dispatcher = new Dispatcher(this)

  onCreate(options: any) {
    if (options.roomId) {
      this.roomId = options.roomId
    }
  }

  async onJoin(client: Client<IUser, IUser>) {
    console.log(client)
  }

  onDispose() {}
}
