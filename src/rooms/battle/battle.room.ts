import { CloseCode } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { BaseRoomPlayer } from "@/rooms/base/base.room.js";
import { BattleEndReasonEnum, BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { OnJoinBattleCommand } from "@/rooms/battle/commands/on-join.battle.command.js";
import { SubmitActionsBattleCommand } from "@/rooms/battle/commands/submit-actions.battle.command.js";
import { BattleState } from "@/rooms/battle/schema/battle.state.js";
import { Player } from "@/modules/player/models/player.model.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { BattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";
import { BattleEventEnum } from "@/rooms/battle/enums/battle.enum.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { OnLeaveBattleCommand } from "@/rooms/battle/commands/on-leave.battle.command.js";
import type { PlayerRankProfile } from "@/modules/ranking/models/player-rank-profile.model.js";
import { timerService } from "@/shares/services/timer.service.js";
import { SubmitExecutingDoneBattleCommand } from "@/rooms/battle/commands/submit-executing-done.battle.command.js";

export class BattleRoom extends BaseRoomPlayer {
    maxClients = 2;
    state = new BattleState();
    dispatcher = new Dispatcher(this);
    timers = new Map<string, ReturnType<typeof this.clock.setTimeout>>();
    botPlayerId: string | null = null;
    withBot: boolean = false;

    actions = new Map<string, number[]>();
    skills = new Map<string, Skill[]>();
    players = new Map<string, Player>();
    rankProfiles = new Map<string, PlayerRankProfile | null>();
    logs: BattleLogDetail[] = [];
    result: {
        winner: string;
        endReason: BattleEndReasonEnum;
    };

    messages = {
        [BattleEventEnum.SUBMIT_ACTIONS_BATTLE]: (client: ClientRoomPlayer, actions: number[]) => {
            this.dispatcher.dispatch(new SubmitActionsBattleCommand(), { client, actions });
        },
        [BattleEventEnum.SUBMIT_EXECUTING_DONE]: (client: ClientRoomPlayer) => {
            this.dispatcher.dispatch(new SubmitExecutingDoneBattleCommand(), { client });
        },
    };

    onCreate(options: { withBot?: boolean; rankMode?: string } = {}) {
        this.state.phase = BattlePhaseEnum.WAITING;
        this.withBot = options.withBot ?? false;
        this.state.rankMode = options.rankMode ?? "";
    }

    async onJoin(client: ClientRoomPlayer, options: any) {
        const playerId = client.auth.playerId.toString();
        this.dispatcher.dispatch(new OnJoinBattleCommand(), { playerId, client });
    }

    async onLeave(client: ClientRoomPlayer, _code: CloseCode) {
        await this.dispatcher.dispatch(new OnLeaveBattleCommand(), { client });
    }

    async onDrop(client: ClientRoomPlayer, code: CloseCode) {
        if (this.state.phase !== BattlePhaseEnum.ENDED) {
            await this.allowReconnection(client, BattleConstants.RECONNECTION_S);
        }
    }

    onDispose() {
        timerService.clearAllTimers(this.timers);
        this.dispatcher.stop();
    }

    onUncaughtException(err: Error, methodName: string) {
        console.log(err);
        console.log(methodName);
    }

    onReconnect(client: ClientRoomPlayer) {
        this.dispatcher.dispatch(new OnReconnectBattleCommand(), { client });
    }
}
