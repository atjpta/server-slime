import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";
import { Types } from "mongoose";
import { BattlePlayerState } from "@/rooms/battle/schema/player.battle.state.js";
import { battleBotService } from "@/rooms/battle/services/battle-bot.service.js";

interface Payload {
    playerId: string;
}

export class OnJoinBattleCommand extends Command<BattleRoom, Payload> {
    validate() {
        return this.state.phase === BattlePhaseEnum.WAITING;
    }

    async execute({ playerId }: Payload) {
        const rankMode = this.state.rankMode;
        const [p, rankProfile] = await Promise.all([
            playerService.getById(playerId),
            rankMode
                ? playerRankProfileService
                      .getPlayerRankProfiles(new Types.ObjectId(playerId), rankMode)
                      .then((docs) => docs[0] ?? null)
                : Promise.resolve(null),
        ]);
        this.room.state.players.set(playerId, BattlePlayerState.from(p));
        this.room.players.set(playerId, p);
        this.room.skills.set(playerId, battleService.genSkillArray(p.skills));
        this.room.rankProfiles.set(playerId, rankProfile);

        if (this.state.players.size === 1 && this.room.withBot) {
            return battleBotService.onJoin(this.room);
        }

        if (this.state.players.size === 2) {
            battleService.initBattleLogs(this.room);
            this.room.clients.forEach((client) => {
                this.room.dispatcher.dispatch(new OnReconnectBattleCommand(), { client });
            });
            return battleService.nextSelectingCommand(this.state.wave);
        }
    }
}
