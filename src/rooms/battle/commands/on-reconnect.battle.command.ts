import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { BattleEventEnum } from "@/rooms/battle/enums/battle.enum.js";

interface Payload {
    client: ClientRoomPlayer;
}

export class OnReconnectBattleCommand extends Command<BattleRoom, Payload> {
    async execute({ client }: Payload) {
        client.send(BattleEventEnum.BATTLE_INIT, {
            players: this.room.players,
            skills: this.room.skills,
            logs: this.room.logs,
        });
    }
}
