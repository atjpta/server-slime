import { Command } from "@colyseus/command";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { StartSelectionBattleCommand } from "@/rooms/battle/commands/start-selection.battle.command.js";
import { BattlePlayerState } from "@/rooms/battle/schema/player.battle.state.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { OnBotJoinBattleCommand } from "@/rooms/battle/commands/on-bot-join.battle.command.js";

interface Payload {
    playerId: string;
    client: ClientRoomPlayer;
}

export class OnJoinBattleCommand extends Command<BattleRoom, Payload> {
    validate() {
        return this.state.phase === BattlePhaseEnum.WAITING;
    }

    async execute({ playerId }: Payload) {
        const p = await playerService.getById(playerId);
        this.state.players.set(playerId, BattlePlayerState.from(p));
        this.room.players.set(playerId, p);
        this.room.skills.set(playerId, battleService.genSkillArray(p.skills));

        if (this.state.players.size === 1 && this.room.withBot) {
            this.room.dispatcher.dispatch(new OnBotJoinBattleCommand());
        }

        if (this.state.players.size === 2) {
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
}
