import { Command } from "@colyseus/command";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { battleItemService } from "@/modules/item/services/battle-item.service.js";
import { BattleItemState } from "@/rooms/battle/schema/battle-item.state.js";
import { timerService } from "@/shares/services/timer.service.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";

export class PhaseSelectingItemBattleCommand extends Command<BattleRoom> {
    async execute() {
        this.state.phase = BattlePhaseEnum.SELECTING_ITEM;
        this.state.items.clear();
        this.state.players.forEach((p) => (p.ready = false));

        const seed = `items-offer-${this.room.roomId}-${this.state.wave}`;
        const items = await battleItemService.getRandomItems(3, seed);
        this.state.items.push(...BattleItemState.fromArray(items));

        timerService.startCountdownTicker(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_ITEM_TICKER,
            BattleConstants.SELECTION_ITEM_TIME_MS,
            this.state
        );

        if (this.room.botPlayerId) {
            battleService.assignRandomItem(this.room, this.room.botPlayerId);
        }

        timerService.setTimer(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_ITEM_TIMER,
            BattleConstants.SELECTION_ITEM_TIME_OUT_MS,
            () => {
                timerService.clearTimer(this.room.timers, BattleTimerEnum.SELECTION_ITEM_TICKER);
                for (const [pId] of this.state.players) {
                    if (!this.state.players.get(pId)!.ready) {
                        battleService.assignRandomItem(this.room, pId);
                    }
                }
                this.room.dispatcher.dispatch(new PhaseSelectingBattleCommand());
            }
        );
    }
}
