import { CloseCode } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { BaseRoomPlayer } from "@/rooms/base/base.room.js";
import { BattleEventEnum, BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { OnJoinBattleCommand } from "@/rooms/battle/commands/on-join.battle.command.js";
import { SubmitActionsBattleCommand } from "@/rooms/battle/commands/submit-actions.battle.command.js";
import { BattleState } from "@/rooms/battle/schema/battle.state.js";
import { Player } from "@/modules/player/models/player.model.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { BattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";

export class BattleRoom extends BaseRoomPlayer {
    maxClients = 2;
    state = new BattleState();
    dispatcher = new Dispatcher(this);
    selectionTimer: ReturnType<typeof this.clock.setTimeout> | null = null;
    selectionTicker: ReturnType<typeof this.clock.setInterval> | null = null;
    botPlayerId: string | null = null;
    withBot: boolean = false;

    actions = new Map<string, number[]>();
    skills = new Map<string, Skill[]>();
    players = new Map<string, Player>();
    logs: BattleLogDetail[] = [];

    messages = {
        submit_actions_battle: (client: ClientRoomPlayer, actions: number[]) => {
            this.dispatcher.dispatch(new SubmitActionsBattleCommand(), { client, actions });
        },
    };

    onCreate(options: { withBot?: boolean } = {}) {
        this.state.phase = BattlePhaseEnum.WAITING;
        this.withBot = options.withBot ?? false;
    }

    async onJoin(client: ClientRoomPlayer, options: any) {
        const playerId = client.auth.playerId.toString();
        this.dispatcher.dispatch(new OnJoinBattleCommand(), { playerId, client });
    }

    async onLeave(client: ClientRoomPlayer, _code: CloseCode) {
        if (this.state.phase !== BattlePhaseEnum.ENDED) {
            try {
                await this.allowReconnection(client, BattleConstants.RECONNECTION_S);
            } catch (e) {
                // client disconnected before fully joining
            }
        }
    }

    async onDrop(client: ClientRoomPlayer, code: CloseCode) {
        if (this.state.phase !== BattlePhaseEnum.ENDED) {
            await this.allowReconnection(client, BattleConstants.RECONNECTION_S);
        }
    }

    onDispose() {
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
