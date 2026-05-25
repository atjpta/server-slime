import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
interface Payload {
    client: ClientRoomPlayer;
}

export class OnLeaveBattleCommand extends Command<BattleRoom, Payload> {
    async execute({ client }: Payload) {
        if (this.room.players.size === 1) {
            this.room.disconnect();
        }
        if (this.state.phase !== BattlePhaseEnum.ENDED) {
            try {
                await this.room.allowReconnection(client, this.room.config.reconnectionS);
            } catch (e) {
                // client disconnected before fully joining
            }
        }
    }
}
