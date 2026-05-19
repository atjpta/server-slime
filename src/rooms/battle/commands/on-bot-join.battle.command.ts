import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { StartSelectionBattleCommand } from "@/rooms/battle/commands/start-selection.battle.command.js";
import { BattlePlayerState } from "@/rooms/battle/schema/player.battle.state.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";

export class OnBotJoinBattleCommand extends Command<BattleRoom> {
    validate() {
        return this.state.players.size === 1;
    }

    async execute() {
        const bot = await playerService.getRandomBot();
        if (!bot) return;

        const botId = bot._id.toString();
        this.room.botPlayerId = botId;
        this.state.players.set(botId, BattlePlayerState.from(bot));
        this.room.players.set(botId, bot);
        this.room.skills.set(botId, battleService.genSkillArray(bot.skills));

        const initialPlayers = new Map<string, PlayerTurnLog>();
        this.room.players.forEach((player, pId) => {
            initialPlayers.set(pId, {
                action: 0,
                damageReceive: [],
                stats: { ...player.stats },
            });
        });
        this.room.logs.push({ turn: 0, wave: 0, players: initialPlayers });

        this.room.clients.forEach((client) => {
            this.room.dispatcher.dispatch(new OnReconnectBattleCommand(), { client });
        });

        await this.delay(BattleConstants.TURN_ANIMATION_MS);
        return new StartSelectionBattleCommand();
    }
}
