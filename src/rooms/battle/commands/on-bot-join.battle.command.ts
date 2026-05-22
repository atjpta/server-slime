import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";
import { Types } from "mongoose";

export class OnBotJoinBattleCommand extends Command<BattleRoom> {
    validate() {
        return this.state.players.size === 1 && this.room.withBot;
    }

    async execute() {
        const bot = await playerService.getRandomBot();
        if (!bot) return;
        const botId = bot._id.toString();
        const rankMode = this.state.rankMode;

        const rankProfile = await (rankMode
            ? playerRankProfileService
                  .getPlayerRankProfiles(new Types.ObjectId(botId), rankMode)
                  .then((docs) => docs[0] ?? null)
            : Promise.resolve(null));

        this.room.botPlayerId = botId;
        battleService.registerPlayer(this.room, botId, bot, rankProfile);
        battleService.initBattleLogs(this.room);

        this.room.clients.forEach((client) => {
            this.room.dispatcher.dispatch(new OnReconnectBattleCommand(), { client });
        });

        return new PhaseSelectingBattleCommand();
    }
}
