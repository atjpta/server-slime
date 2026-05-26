import { Command } from "@colyseus/command";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { battleItemService } from "@/modules/item/services/battle-item.service.js";
import { BattleItemState } from "@/rooms/battle/schema/battle-item.state.js";
import { timerService } from "@/shares/services/timer.service.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { battleBotService } from "@/rooms/battle/services/battle-bot.service.js";

export class PhaseSelectingItemBattleCommand extends Command<BattleRoom> {
    async execute() {
        this.state.phase = BattlePhaseEnum.SELECTING_ITEM;
        this.state.players.forEach((p) => (p.ready = false));

        await Promise.all(
            [...this.state.players.entries()].map(async ([pId, player]) => {
                const items = await battleItemService.getRandomItems(3);
                player.offeredItems.clear();
                player.offeredItems.push(...BattleItemState.fromArray(items));
                this.room.waveItemLogs.set(pId, {
                    offeredItems: items.map((i) => ({ code: i.code, type: i.type, rule: i.rule })),
                });
            })
        );

        battleBotService.submitSelectItem(this.room);
        timerService.startCountdownTicker(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_ITEM_TICKER,
            this.room.config.selectionItemTimeMs,
            this.state
        );
        timerService.setTimer(
            this.room.timers,
            this.clock,
            BattleTimerEnum.SELECTION_ITEM_TIMER,
            this.room.config.selectionItemTimeOutMs,
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
