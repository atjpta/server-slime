import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { StartExecutionBattleCommand } from "@/rooms/battle/commands/start-execution.battle.command.js";

interface Payload {
    client: ClientRoomPlayer;
    actions: number[];
}

export class SubmitActionsBattleCommand extends Command<BattleRoom, Payload> {
    validate({ client, actions }: Payload) {
        const maxLengthSkill = this.room.skills.get(client.auth.playerId.toString()).length;

        for (const action of actions) {
            if (action >= maxLengthSkill) {
                return false;
            }
        }
        return this.state.phase === BattlePhaseEnum.SELECTING;
    }

    execute({ client, actions }: Payload) {
        const playerId = client.auth.playerId.toString();
        this.room.actions.set(playerId, actions);
        this.state.players.get(playerId).ready = true;
        if (this.room.actions.size === 2) {
            this.room.selectionTimer?.clear();
            return new StartExecutionBattleCommand();
        }
    }
}
