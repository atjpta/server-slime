import { Command } from "@colyseus/command";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { PhaseExecutingBattleCommand } from "@/rooms/battle/commands/phase-executing.battle.command.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { timerService } from "@/shares/services/timer.service.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
export class PhaseSelectingBattleCommand extends Command<BattleRoom> {
    execute() {
        this.state.phase = BattlePhaseEnum.SELECTING;
        this.state.wave += 1;
        this.room.actions.clear();
        this.room.selectedItems.clear();
        this.room.waveDamageBuff.clear();
        this.state.players.forEach((p) => {
            p.ready = false;
            p.actions.clear();
        });

        timerService.startCountdownTicker(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_TICKER,
            BattleConstants.SELECTION_TIME_MS,
            this.state
        );

        if (this.room.botPlayerId) {
            battleService.assignBotItem(this.room, this.room.botPlayerId, this.state.wave);
            battleService.assignRandomAction(this.room, this.room.botPlayerId, this.state.wave);
        }

        timerService.setTimer(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_TIMER,
            BattleConstants.SELECTION_TIME_OUT_MS,
            () => {
                timerService.clearTimer(this.room.timers, BattleTimerEnum.SELECTION_TICKER);
                for (const [pId] of this.state.players) {
                    if (!this.room.actions.has(pId)) {
                        battleService.assignRandomAction(this.room, pId, this.state.wave);
                    }
                }
                this.room.dispatcher.dispatch(new PhaseExecutingBattleCommand());
            }
        );
    }
}
