import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattleEndReasonEnum, BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { battleLogService } from "@/modules/battle-log/services/battle-log.service.js";
import { rankBattleService } from "@/modules/ranking/services/rank-battle.service.js";

interface Payload {
    winner: string;
    endReason: BattleEndReasonEnum;
}

export class EndBattleCommand extends Command<BattleRoom, Payload> {
    async execute({ winner, endReason }: Payload) {
        this.state.phase = BattlePhaseEnum.ENDED;
        this.state.winner = winner;

        await battleLogService.createByBattleRoom(this.room, winner, endReason);
        const rankChanges = await rankBattleService.processRankResult(this.room, winner, endReason);
        rankBattleService.broadcastRankChanges(this.room, rankChanges);
        this.room.disconnect();
    }
}
