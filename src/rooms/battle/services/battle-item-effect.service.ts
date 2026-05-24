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

export class BattleItemEffectService {
    applyItemEffects(room: BattleRoom, playerIds: string[], wave: number): BattleLogDetail | null {
        const prevLog = room.logs[room.logs.length - 1];
        const maxHpLog = room.logs[0];
        const players = new Map<string, PlayerTurnLog>();
        let hasEffect = false;

        for (const playerId of playerIds) {
            const selected = room.selectedItems.get(playerId);
            const prevStats = { ...prevLog.players.get(playerId)!.stats };
            const effects: EffectBattle[] = [];

            let itemUsed: ItemUsedLog | undefined;

            if (selected?.itemIndex !== undefined) {
                const playerState = room.state.players.get(playerId)!;
                const item = playerState.items[selected.itemIndex];

                if (item) {
                    if (item.code === "heal-001") {
                        const maxHp = maxHpLog.players.get(playerId)!.stats.hp;
                        this.applyHeal(prevStats, effects, item.rule.scale.hp, maxHp);
                        itemUsed = { code: item.code };
                        hasEffect = true;
                    } else if (
                        selected.itemApplyIndex !== undefined &&
                        item.rule.scale.damage > 0
                    ) {
                        this.applyDamageBuff(room, playerId, item, selected.itemApplyIndex);
                    }

                    playerState.items.splice(selected.itemIndex, 1);
                }
            }

            players.set(playerId, {
                action: 0,
                damageReceive: effects,
                stats: prevStats,
                itemUsed,
            });
        }

        if (!hasEffect) return null;
        return { wave, turn: 0, players };
    }

    private applyHeal(stats: PlayerStats, effects: EffectBattle[], scale: number, maxHp: number) {
        const healAmount = Math.floor(scale * maxHp);
        stats.hp = Math.min(stats.hp + healAmount, maxHp);
        effects.push({ typeEffect: EffectBattleEnum.HEAL, value: healAmount });
    }

    private applyDamageBuff(room: BattleRoom, playerId: string, item: BattleItemState, turnIndex: number): void {
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
}

export const battleItemEffectService = new BattleItemEffectService();
