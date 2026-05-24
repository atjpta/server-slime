import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import {
    BattleEventEnum,
    BattlePhaseEnum,
    BattleTimerEnum,
} from "@/rooms/battle/enums/battle.enum.js";
import { battleCalcService } from "@/rooms/battle/services/battle-calc.service.js";
import { battleItemEffectService } from "@/rooms/battle/services/battle-item-effect.service.js";
import { BattleLogDetail, PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { timerService } from "@/shares/services/timer.service.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";

export class PhaseExecutingBattleCommand extends Command<BattleRoom> {
    async execute() {
        this.state.phase = BattlePhaseEnum.EXECUTING;

        const [p1Id, p2Id] = [...this.state.players.keys()];
        const wave = this.state.wave;
        const p1Actions = this.room.actions.get(p1Id);
        const p2Actions = this.room.actions.get(p2Id);

        this.state.players.forEach((p) => {
            p.ready = false;
            p.actions.clear();
            p.actions.push(...this.room.actions.get(p.playerId));
        });

        const waveLog: BattleLogDetail[] = [];

        const turn0Log = battleItemEffectService.applyItemEffects(this.room, [p1Id, p2Id], wave);
        if (turn0Log) {
            waveLog.push(turn0Log);
            this.room.logs.push(turn0Log);
        }

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

            const p1Buff = this.room.waveDamageBuff.get(p1Id);
            const p2Buff = this.room.waveDamageBuff.get(p2Id);
            const { p1Effects, p2Effects } = battleCalcService.updateStats(
                {
                    skill: p1Skill,
                    stats: p1Stats,
                    damageBuff: p1Buff?.turnIndex === turn - 1 ? p1Buff.scale : undefined,
                },
                {
                    skill: p2Skill,
                    stats: p2Stats,
                    damageBuff: p2Buff?.turnIndex === turn - 1 ? p2Buff.scale : undefined,
                }
            );

            const players = new Map<string, PlayerTurnLog>([
                [
                    p1Id,
                    {
                        action: p1Action,
                        damageReceive: p1Effects,
                        stats: { ...p1Stats },
                        itemUsed:
                            p1Buff?.turnIndex === turn - 1
                                ? {
                                      code: p1Buff.itemCode,
                                      applyTurnIndex: turn - 1,
                                      rule: p1Buff.itemRule,
                                  }
                                : undefined,
                    },
                ],
                [
                    p2Id,
                    {
                        action: p2Action,
                        damageReceive: p2Effects,
                        stats: { ...p2Stats },
                        itemUsed:
                            p2Buff?.turnIndex === turn - 1
                                ? {
                                      code: p2Buff.itemCode,
                                      applyTurnIndex: turn - 1,
                                      rule: p2Buff.itemRule,
                                  }
                                : undefined,
                    },
                ],
            ]);
            const turnLog: BattleLogDetail = { turn, wave, players };
            waveLog.push(turnLog);
            this.room.logs.push(turnLog);
            const result = battleCalcService.getBattleResult(players);
            if (result) {
                this.room.result = result;
                break;
            }
        }
        this.room.broadcast(BattleEventEnum.BATTLE_LOG, waveLog);

        if (this.state.wave >= BattleConstants.MAX_WAVE) {
            this.room.result = battleCalcService.getBattleResult(
                this.room.logs[this.room.logs.length - 1].players,
                wave,
                BattleConstants.MAX_WAVE
            );
        }

        timerService.setTimer(
            this.room.timers,
            this.room.clock,
            BattleTimerEnum.EXECUTING_DONE_TIMER,
            BattleConstants.EXECUTING_DONE_TIMEOUT_MS,
            () => {
                this.room.dispatcher.dispatch(
                    battleService.nextOrEndPhaseCommand(
                        this.room,
                        battleService.nextSelectingCommand(wave)
                    )
                );
            }
        );
    }
}
