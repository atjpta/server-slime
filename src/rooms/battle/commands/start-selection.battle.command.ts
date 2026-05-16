import { Command } from "@colyseus/command";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { StartExecutionBattleCommand } from "@/rooms/battle/commands/start-execution.battle.command.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";

export class StartSelectionBattleCommand extends Command<BattleRoom> {
    execute() {
        this.state.phase = BattlePhaseEnum.SELECTING;
        this.state.wave += 1;
        this.room.actions.clear();

        for (const [pId, _] of this.state.players) {
            const p = this.state.players.get(pId);
            p.ready = false;
            p.actions.clear();
        }

        let timeLeft = BattleConstants.SELECTION_TIME_MS / 1000;
        this.state.timeLeft = timeLeft;

        const ticker = this.clock.setInterval(() => {
            timeLeft -= 1;
            this.state.timeLeft = timeLeft;
            if (timeLeft <= 0) ticker.clear();
        }, 1000);

        if (this.room.botPlayerId) {
            const botId = this.room.botPlayerId;
            const botActions = battleService.getActionRandom(
                this.room.skills.get(botId),
                `${this.room.roomId}-${botId}-${this.state.wave}`
            );
            this.room.actions.set(botId, botActions);
            this.state.players.get(botId).ready = true;
        }

        this.room.selectionTimer = this.clock.setTimeout(() => {
            ticker.clear();
            for (const [pId, _] of this.state.players) {
                if (this.room.actions.has(pId)) {
                    continue;
                }
                this.room.actions.set(
                    pId,
                    battleService.getActionRandom(this.room.skills.get(pId), `${this.room.roomId}-${pId}-${this.state.wave}`)
                );
                this.state.players.get(pId).ready = true;
            }
            this.room.dispatcher.dispatch(new StartExecutionBattleCommand());
        }, BattleConstants.SELECTION_TIME_MS);
    }
}
