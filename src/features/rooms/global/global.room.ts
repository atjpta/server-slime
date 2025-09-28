import { Client, matchMaker } from '@colyseus/core'
import { IUser } from '~/features/users/auth/models'
import { GlobalState } from './schema/global.state'
import { BaseRoom } from '~/core/rooms/base-room'
import { RoomIdEnum, RoomNameEnum } from '~/shared/enums'
import { Dispatcher } from '@colyseus/command'
import { GlobalCommand } from './commands'

export class GlobalRoom extends BaseRoom<GlobalState> {
  state = new GlobalState()
  dispatcher = new Dispatcher(this)

  onCreate(options: any) {
    if (options.roomId) {
      this.roomId = options.roomId
    }
  }

  async onJoin(client: Client<IUser, IUser>) {
    this.dispatcher.dispatch(new GlobalCommand.OnJoinCommand(), {
      client,
    })

    this.dispatcher.dispatch(new GlobalCommand.OnAuthCommand(), {
      client,
      clients: this.clients,
    })
  }

  onDispose() {
    if (this.roomId === RoomIdEnum.GLOBAL_ROOM) {
      matchMaker.createRoom(RoomNameEnum.GLOBAL_ROOM, {
        roomId: RoomIdEnum.GLOBAL_ROOM,
      })
    }
    this.dispatcher.stop()
  }
}
