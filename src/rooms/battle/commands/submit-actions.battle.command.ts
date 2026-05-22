import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { PhaseExecutingBattleCommand } from "@/rooms/battle/commands/phase-executing.battle.command.js";
import { timerService } from "@/shares/services/timer.service.js";

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
            timerService.clearTimer(this.room.timers, [
                BattleTimerEnum.SELECTION_TIMER,
                BattleTimerEnum.SELECTION_TICKER,
            ]);
            return new PhaseExecutingBattleCommand();
        }
    }
}
