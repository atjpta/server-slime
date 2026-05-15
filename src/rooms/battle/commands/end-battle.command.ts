import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattleEndReasonEnum, BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { battleLogService } from "@/modules/battle-log/services/battle-log.service.js";

interface Payload {
    winner: string;
    endReason: BattleEndReasonEnum;
}

export class EndBattleCommand extends Command<BattleRoom, Payload> {
    async execute({ winner, endReason }: Payload) {
        this.state.phase = BattlePhaseEnum.ENDED;
        this.state.winner = winner;
        await battleLogService.createByBattleRoom(this.room, winner, endReason);
        this.clock.setTimeout(() => this.room.disconnect(), 3000);
    }
}
