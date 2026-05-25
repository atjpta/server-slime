import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { battleLogService } from "@/modules/battle-log/services/battle-log.service.js";
import { rankBattleService } from "@/modules/ranking/services/rank-battle.service.js";
interface Payload {}

export class PhaseEndedBattleCommand extends Command<BattleRoom, Payload> {
    async execute({}: Payload) {
        this.state.phase = BattlePhaseEnum.ENDED;
        const winner = this.room.result.winner;
        const endReason = this.room.result.endReason;
        this.state.winner = winner;

        const rankChanges = await rankBattleService.processRankResult(this.room, winner, endReason);
        rankBattleService.broadcastRankChanges(this.room, rankChanges);

        await battleLogService.createByBattleRoom(this.room, winner, endReason);

        await this.delay(this.room.config.endedDelayMs);
        this.room.disconnect();
    }
}
