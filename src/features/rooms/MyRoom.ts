import { Room, Client } from '@colyseus/core'
import { MyRoomState } from './schema/MyRoomState'

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4
  state = new MyRoomState()

  onCreate(options: any) {
    console.log(options)

    this.onMessage('type', (client, message) => {
      console.log(client, message)

      //
      //   handle "type" message
      //
    })
  }

  onJoin(client: Client, options: any) {
    console.log(options)

    console.log(client.sessionId, 'joined!')
  }

  onLeave(client: Client, consented: boolean) {
    console.log(consented)

    console.log(client.sessionId, 'left!')
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}
