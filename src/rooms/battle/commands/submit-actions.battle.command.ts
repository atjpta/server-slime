import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { PhaseExecutingBattleCommand } from "@/rooms/battle/commands/phase-executing.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
interface Payload {
    playerId: string;
    actions: number[];
    itemIndex?: number;
    itemApplyIndex?: number;
}

export class SubmitActionsBattleCommand extends Command<BattleRoom, Payload> {
    validate({ playerId, actions, itemIndex, itemApplyIndex }: Payload) {
        if (!battleService.canSubmit(this.room, playerId, BattlePhaseEnum.SELECTING)) {
            return false;
        }
        const maxLengthSkill = this.room.skills.get(playerId).length;
        if (!actions.every((action) => action < maxLengthSkill)) return false;
        const player = this.state.players.get(playerId)!;
        if (itemIndex !== undefined && !(itemIndex >= 0 && itemIndex < player.items.length))
            return false;
        if (
            itemApplyIndex !== undefined &&
            !(itemApplyIndex >= 0 && itemApplyIndex < this.room.config.turnsPerWave - 1)
        )
            return false;
        return true;
    }

    execute({ playerId, actions, itemIndex, itemApplyIndex }: Payload) {
        this.room.actions.set(playerId, actions);
        if (itemIndex !== undefined || itemApplyIndex !== undefined) {
            this.room.selectedItems.set(playerId, { itemIndex, itemApplyIndex });
        }
        this.state.players.get(playerId).ready = true;
        return battleService.ifAllReadyAdvance(
            this.room,
            [BattleTimerEnum.SELECTION_TIMER, BattleTimerEnum.SELECTION_TICKER],
            new PhaseExecutingBattleCommand()
        );
    }
}
