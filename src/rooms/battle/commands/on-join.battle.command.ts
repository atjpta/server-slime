import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { OnBotJoinBattleCommand } from "@/rooms/battle/commands/on-bot-join.battle.command.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";
import { Types } from "mongoose";

interface Payload {
    playerId: string;
    client: ClientRoomPlayer;
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
        battleService.registerPlayer(this.room, playerId, p, rankProfile);

        if (this.state.players.size === 1 && this.room.withBot) {
            return new OnBotJoinBattleCommand();
        }

        if (this.state.players.size === 2) {
            battleService.initBattleLogs(this.room);
            this.room.clients.forEach((client) => {
                this.room.dispatcher.dispatch(new OnReconnectBattleCommand(), { client });
            });
            return new PhaseSelectingBattleCommand();
        }
    }
}
