import {
    BattleLogDetail,
    EffectBattle,
    ItemUsedLog,
    PlayerTurnLog,
} from "@/modules/battle-log/models/battle-log.model.js";
import { EffectBattleEnum } from "@/rooms/battle/enums/effect.enum.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { PlayerStats } from "@/modules/player/models/player.model.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleItemState } from "@/rooms/battle/schema/battle-item.state.js";
import { BattleItemCode } from "@/modules/item/enums/battle-item.enum.js";
import seedrandom from "seedrandom";

export class BattleItemEffectService {
    applyItemEffects(room: BattleRoom, playerIds: string[], wave: number): BattleLogDetail | null {
        const [p1Id, p2Id] = playerIds;
        const prevLog = room.logs[room.logs.length - 1];
        const maxHpLog = room.logs[0];

        const actionsBefore = new Map(
            playerIds.map((id) => [id, [...(room.actions.get(id) ?? [])]])
        );

        const selectedItems = new Map(
            playerIds.map((id) => {
                const selected = room.selectedItems.get(id);
                if (selected?.itemIndex === undefined) return [id, null] as const;
                return [id, room.state.players.get(id)?.items[selected.itemIndex] ?? null] as const;
            })
        );

        const players = new Map<string, PlayerTurnLog>();
        let hasEffect = false;
        let stormApplied = false;

        for (const playerId of playerIds) {
            const opponentId = playerId === p1Id ? p2Id : p1Id;
            const selected = room.selectedItems.get(playerId);
            const prevStats = { ...prevLog.players.get(playerId)!.stats };
            const effects: EffectBattle[] = [];
            let itemUsed: ItemUsedLog | undefined;

            const item = selectedItems.get(playerId);

            if (item && selected?.itemIndex !== undefined) {
                switch (item.code) {
                    case BattleItemCode.HEAL_001: {
                        const maxHp = maxHpLog.players.get(playerId)!.stats.hp;
                        this.applyHeal(prevStats, effects, item.rule.scale.hp, maxHp);
                        itemUsed = { code: item.code };
                        hasEffect = true;
                        break;
                    }
                    case BattleItemCode.DAMAGE_001: {
                        if (selected.itemApplyIndex !== undefined) {
                            this.applyDamageBuff(room, playerId, item, selected.itemApplyIndex);
                        }
                        break;
                    }
                    case BattleItemCode.PUSH_001: {
                        this.applyPush(room, opponentId);
                        itemUsed = { code: item.code };
                        hasEffect = true;
                        break;
                    }
                    case BattleItemCode.SHUFFLE_001: {
                        this.applyShuffle(room, opponentId);
                        itemUsed = { code: item.code };
                        hasEffect = true;
                        break;
                    }
                    case BattleItemCode.STORM_001: {
                        if (!stormApplied) {
                            this.applyShuffle(room, p1Id);
                            this.applyShuffle(room, p2Id);
                            stormApplied = true;
                        }
                        itemUsed = { code: item.code };
                        hasEffect = true;
                        break;
                    }
                }

                room.state.players.get(playerId)!.items.splice(selected.itemIndex, 1);
            }

            players.set(playerId, {
                action: 0,
                damageReceive: effects,
                stats: prevStats,
                itemUsed,
            });
        }

        for (const playerId of playerIds) {
            const before = actionsBefore.get(playerId)!;
            const after = room.actions.get(playerId) ?? [];
            if (before.join(",") !== after.join(",")) {
                players.get(playerId)!.actionsAffected = { before, after: [...after] };
            }
        }

        if (!hasEffect) return null;
        return { wave, turn: 0, players };
    }

    private applyHeal(stats: PlayerStats, effects: EffectBattle[], scale: number, maxHp: number) {
        const healAmount = Math.floor(scale * maxHp);
        stats.hp = Math.min(stats.hp + healAmount, maxHp);
        effects.push({ typeEffect: EffectBattleEnum.HEAL, value: healAmount });
    }

    private applyDamageBuff(
        room: BattleRoom,
        playerId: string,
        item: BattleItemState,
        turnIndex: number
    ): void {
        room.waveDamageBuff.set(playerId, {
            turnIndex,
            scale: item.rule.scale.damage,
            itemCode: item.code,
            itemRule: {
                phase: item.rule.phase as BattlePhaseEnum,
                scale: { damage: item.rule.scale.damage },
            },
        });
    }

    private applyPush(room: BattleRoom, targetId: string, n = 1): void {
        const actions = room.actions.get(targetId);
        if (!actions?.length) return;
        const shift = ((n % actions.length) + actions.length) % actions.length;
        actions.splice(0, actions.length, ...actions.slice(-shift), ...actions.slice(0, -shift));
        this.syncActionsToState(room, targetId, actions);
    }

    private applyShuffle(room: BattleRoom, targetId: string): void {
        const actions = room.actions.get(targetId);
        if (!actions?.length) return;
        const rng = seedrandom(`shuffle-${room.roomId}-${targetId}-${room.state.wave}`);
        for (let i = actions.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [actions[i], actions[j]] = [actions[j], actions[i]];
        }
        this.syncActionsToState(room, targetId, actions);
    }

    private syncActionsToState(room: BattleRoom, playerId: string, actions: number[]): void {
        const playerState = room.state.players.get(playerId);
        if (!playerState) return;
        playerState.actions.clear();
        playerState.actions.push(...actions);
    }
}

export const battleItemEffectService = new BattleItemEffectService();
