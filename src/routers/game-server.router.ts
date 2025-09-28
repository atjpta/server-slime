import { matchMaker, Server } from '@colyseus/core'
import { GlobalRoom } from '~/features/rooms/global/global.room'
import { RoomIdEnum, RoomNameEnum } from '~/shared/enums'

export const gameServerRouter = (gameServer: Server) => {
  gameServer.define(RoomNameEnum.GLOBAL_ROOM, GlobalRoom)

  matchMaker.disconnectAll()

  matchMaker.createRoom(RoomNameEnum.GLOBAL_ROOM, {
    roomId: RoomIdEnum.GLOBAL_ROOM,
  })
}
