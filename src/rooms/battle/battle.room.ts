import { Client, CloseCode } from "colyseus";
import { BaseRoomPlayer } from "@/rooms/base/base.room.js";
import { MyRoomState } from "./schema/battle.state.shema.js";
import { AuthRoomPlayer } from "@/modules/player/types/auth-player.type.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";

export class BattleRoom extends BaseRoomPlayer {
    maxClients = 2;
    state = new MyRoomState();

    messages = {
        yourMessageType: (client: ClientRoomPlayer, message: any) => {
            console.log(client.sessionId, "sent a message:", message);
        },
    };

    onCreate(options: any) {
        console.log("BattleRoom is created ");
    }

    onJoin(client: ClientRoomPlayer, options: any) {
        console.log(client);

        console.log(`${client.sessionId} - ${client.auth.playerId}`, "joined!");
    }

    async onLeave(client: ClientRoomPlayer, code: CloseCode) {
        await this.allowReconnection(client, 30);
    }

    async onDrop(client: ClientRoomPlayer, code: CloseCode) {
        await this.allowReconnection(client, 30);
    }

    onDispose() {
        /**
         * Called when the room is disposed.
         */
        console.log("room", this.roomId, "disposing...");
    }
}
