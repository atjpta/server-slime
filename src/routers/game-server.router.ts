import { Server } from '@colyseus/core'
import { MyRoom } from '~/features/rooms/MyRoom'

export const gameServerRouter = (gameServer: Server) => {
  gameServer.define('my_room', MyRoom)
}
