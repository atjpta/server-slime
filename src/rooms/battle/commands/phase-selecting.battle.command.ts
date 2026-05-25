import { Command } from "@colyseus/command";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { PhaseExecutingBattleCommand } from "@/rooms/battle/commands/phase-executing.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { battleBotService } from "@/rooms/battle/services/battle-bot.service.js";
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

        battleBotService.submitActions(this.room);

        timerService.startCountdownTicker(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_TICKER,
            this.room.config.selectionTimeMs,
            this.state
        );

        timerService.setTimer(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_TIMER,
            this.room.config.selectionTimeOutMs,
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
