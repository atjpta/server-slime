import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { timerService } from "@/shares/services/timer.service.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";

interface Payload {
    client: ClientRoomPlayer;
}

export class SubmitExecutingDoneBattleCommand extends Command<BattleRoom, Payload> {
    validate({ client }: Payload) {
        return this.state.phase === BattlePhaseEnum.EXECUTING;
    }

    execute({ client }: Payload) {
        const playerId = client.auth.playerId.toString();
        const playerState = this.state.players.get(playerId);
        if (!playerState || playerState.executingDone) return;

        playerState.executingDone = true;

        if (this.room.withBot) {
            return this.nextCommand();
        }

        let allDone = true;
        this.state.players.forEach((p) => {
            if (!p.executingDone) allDone = false;
        });

        if (allDone) {
            return this.nextCommand();
        }
    }

    private nextCommand() {
        timerService.clearTimer(this.room.timers, BattleTimerEnum.EXECUTING_DONE_TIMER);
        return battleService.nextOrEndPhaseCommand(this.room, new PhaseSelectingBattleCommand());
    }
}
