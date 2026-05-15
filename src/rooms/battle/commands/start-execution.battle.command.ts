import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import {
    BattleEndReasonEnum,
    BattleEventEnum,
    BattlePhaseEnum,
} from "@/rooms/battle/enums/battle.enum.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { EndBattleCommand } from "@/rooms/battle/commands/end-battle.command.js";
import { StartSelectionBattleCommand } from "@/rooms/battle/commands/start-selection.battle.command.js";
import { IBattleLogDetail, IPlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";

export class StartExecutionBattleCommand extends Command<BattleRoom> {
    async execute() {
        this.state.phase = BattlePhaseEnum.EXECUTING;
        const [p1Id, p2Id] = [...this.state.players.keys()];

        const p1Actions = this.room.actions.get(p1Id);
        const p2Actions = this.room.actions.get(p2Id);

        this.state.players.get(p1Id).actions.push(...p1Actions);
        this.state.players.get(p2Id).actions.push(...p2Actions);

        for (let turn = 1; turn < BattleConstants.TURNS_PER_WAVE + 1; turn++) {
            const wave = this.state.wave;
            const logTurnBefore = this.room.logs[this.room.logs.length - 1];

            const p1Action = p1Actions[turn - 1];
            const p2Action = p2Actions[turn - 1];

            const p1Prev = logTurnBefore.players.get(p1Id);
            const p2Prev = logTurnBefore.players.get(p2Id);

            const p1Stats = { ...p1Prev.stats };
            const p2Stats = { ...p2Prev.stats };

            const p1Skill = this.room.skills.get(p1Id)[p1Action];
            const p2Skill = this.room.skills.get(p2Id)[p2Action];

            const { p1Effects, p2Effects } = battleService.updateStats(
                { skill: p1Skill, stats: p1Stats },
                { skill: p2Skill, stats: p2Stats }
            );

            const players = new Map<string, IPlayerTurnLog>([
                [p1Id, { action: p1Action, damageReceive: p1Effects, stats: { ...p1Stats } }],
                [p2Id, { action: p2Action, damageReceive: p2Effects, stats: { ...p2Stats } }],
            ]);
            const turnLog: IBattleLogDetail = { turn, wave, players };
            this.room.logs.push(turnLog);
            this.room.broadcast(BattleEventEnum.BATTLE_LOG, turnLog);

            const p1Dead = battleService.isDead(p1Stats.hp);
            const p2Dead = battleService.isDead(p2Stats.hp);
            if (p1Dead || p2Dead) {
                const winner = p1Dead && p2Dead ? null : p1Dead ? p2Id : p1Id;
                const endReason =
                    p1Dead && p2Dead ? BattleEndReasonEnum.DRAW : BattleEndReasonEnum.HP_DEPLETED;
                return new EndBattleCommand().setPayload({ winner, endReason });
            }
            await this.delay(BattleConstants.TURN_ANIMATION_MS);
        }
        if (this.state.wave >= BattleConstants.MAX_WAVE) {
            const lastLog = this.room.logs[this.room.logs.length - 1];
            const p1Hp = lastLog.players.get(p1Id).stats.hp;
            const p2Hp = lastLog.players.get(p2Id).stats.hp;
            const winner = p1Hp === p2Hp ? "draw" : p1Hp > p2Hp ? p1Id : p2Id;
            return new EndBattleCommand().setPayload({
                winner,
                endReason: BattleEndReasonEnum.MAX_WAVES,
            });
        }
        return new StartSelectionBattleCommand();
    }
}
