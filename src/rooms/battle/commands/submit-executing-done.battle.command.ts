import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";

interface Payload {
    playerId: string;
}

export class SubmitExecutingDoneBattleCommand extends Command<BattleRoom, Payload> {
    validate({ playerId }: Payload) {
        return battleService.canSubmit(this.room, playerId, BattlePhaseEnum.EXECUTING);
    }

    execute({ playerId }: Payload) {
        const playerState = this.state.players.get(playerId)!;
        playerState.ready = true;

        return battleService.ifAllReadyAdvance(
            this.room,
            [BattleTimerEnum.EXECUTING_DONE_TIMER],
            battleService.nextOrEndPhaseCommand(
                this.room,
                battleService.nextSelectingCommand(this.state.wave)
            )
        );
    }
}
