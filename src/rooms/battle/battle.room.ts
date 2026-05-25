import { CloseCode } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { BaseRoomPlayer } from "@/rooms/base/base.room.js";
import { BattleEndReasonEnum, BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleItemRule } from "@/modules/item/models/battle-item.model.js";
import { ClientRoomPlayer } from "@/rooms/base/types/client-room-player.type.js";
import { OnJoinBattleCommand } from "@/rooms/battle/commands/on-join.battle.command.js";
import { SubmitActionsBattleCommand } from "@/rooms/battle/commands/submit-actions.battle.command.js";
import { BattleState } from "@/rooms/battle/schema/battle.state.js";
import { Player } from "@/modules/player/models/player.model.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { BattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";
import { masterDataService } from "@/modules/master-data/services/master-data.service.js";
import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import { BattleConfigValue } from "@/modules/master-data/models/master-data.model.js";
import { BattleEventEnum } from "@/rooms/battle/enums/battle.enum.js";
import { OnReconnectBattleCommand } from "@/rooms/battle/commands/on-reconnect.battle.command.js";
import { OnLeaveBattleCommand } from "@/rooms/battle/commands/on-leave.battle.command.js";
import type { PlayerRankProfile } from "@/modules/ranking/models/player-rank-profile.model.js";
import { timerService } from "@/shares/services/timer.service.js";
import { SubmitExecutingDoneBattleCommand } from "@/rooms/battle/commands/submit-executing-done.battle.command.js";
import { SubmitSelectItemBattleCommand } from "@/rooms/battle/commands/submit-select-item.battle.command.js";

export class BattleRoom extends BaseRoomPlayer {
    maxClients = 2;
    state = new BattleState();
    dispatcher = new Dispatcher(this);
    timers = new Map<string, ReturnType<typeof this.clock.setTimeout>>();
    config: BattleConfigValue;
    botPlayerId: string | null = null;
    withBot: boolean = false;

    actions = new Map<string, number[]>();
    selectedItems = new Map<string, { itemIndex?: number; itemApplyIndex?: number }>();
    waveDamageBuff = new Map<
        string,
        { turnIndex: number; scale: number; itemCode: string; itemRule: BattleItemRule }
    >();
    skills = new Map<string, Skill[]>();
    players = new Map<string, Player>();
    rankProfiles = new Map<string, PlayerRankProfile | null>();
    logs: BattleLogDetail[] = [];
    result: {
        winner: string;
        endReason: BattleEndReasonEnum;
    };

    messages = {
        [BattleEventEnum.SUBMIT_ACTIONS_BATTLE]: (
            client: ClientRoomPlayer,
            {
                actions,
                itemIndex,
                itemApplyIndex,
            }: { actions: number[]; itemIndex?: number; itemApplyIndex?: number }
        ) => {
            const playerId = client.auth.playerId.toString();
            this.dispatcher.dispatch(new SubmitActionsBattleCommand(), {
                playerId,
                actions,
                itemIndex,
                itemApplyIndex,
            });
        },
        [BattleEventEnum.SUBMIT_EXECUTING_DONE]: (client: ClientRoomPlayer) => {
            const playerId = client.auth.playerId.toString();
            this.dispatcher.dispatch(new SubmitExecutingDoneBattleCommand(), { playerId });
        },
        [BattleEventEnum.SUBMIT_SELECT_ITEM]: (
            client: ClientRoomPlayer,
            { itemIndex, swapIndex }: { itemIndex: number; swapIndex?: number }
        ) => {
            const playerId = client.auth.playerId.toString();
            this.dispatcher.dispatch(new SubmitSelectItemBattleCommand(), {
                playerId,
                itemIndex,
                swapIndex,
            });
        },
    };

    async onCreate(options: { withBot?: boolean; rankMode?: string } = {}) {
        const masterData = await masterDataService.getByKey(MasterDataKey.BATTLE_CONFIG);
        if (!masterData) throw new Error("BATTLE_CONFIG master data not found");
        this.config = masterData.value as BattleConfigValue;

        this.state.phase = BattlePhaseEnum.WAITING;
        this.withBot = options.withBot ?? false;
        this.state.rankMode = options.rankMode ?? "";
    }

    async onJoin(client: ClientRoomPlayer, options: any) {
        const playerId = client.auth.playerId.toString();
        this.dispatcher.dispatch(new OnJoinBattleCommand(), { playerId });
    }

    async onLeave(client: ClientRoomPlayer, _code: CloseCode) {
        await this.dispatcher.dispatch(new OnLeaveBattleCommand(), { client });
    }

    async onDrop(client: ClientRoomPlayer, code: CloseCode) {
        if (this.state.phase !== BattlePhaseEnum.ENDED) {
            await this.allowReconnection(client, this.config.reconnectionS);
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
