import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
interface Payload {
    playerId: string;
    itemIndex?: number;
    swapIndex?: number;
}

export class SubmitSelectItemBattleCommand extends Command<BattleRoom, Payload> {
    validate({ playerId, itemIndex, swapIndex }: Payload) {
        if (!battleService.canSubmit(this.room, playerId, BattlePhaseEnum.SELECTING_ITEM)) {
            return false;
        }

        if (itemIndex === undefined) {
            return true;
        }
        if (!this.state.items[itemIndex]) {
            return false;
        }

        const player = this.state.players.get(playerId)!;
        if (swapIndex !== undefined && player.items.length >= this.room.config.maxItemSlots) {
            return swapIndex >= 0 && swapIndex < player.items.length;
        }
        return true;
    }

    execute({ playerId, itemIndex, swapIndex }: Payload) {
        const player = this.state.players.get(playerId)!;
        if (itemIndex !== undefined) {
            const picked = this.state.items[itemIndex].clone();
            if (player.items.length < this.room.config.maxItemSlots) {
                player.items.push(picked);
            } else if (swapIndex !== undefined) {
                player.items.splice(swapIndex, 1, picked);
            }
        }

        player.ready = true;

        return battleService.ifAllReadyAdvance(
            this.room,
            [BattleTimerEnum.SELECTION_ITEM_TIMER, BattleTimerEnum.SELECTION_ITEM_TICKER],
            new PhaseSelectingBattleCommand()
        );
    }
}
