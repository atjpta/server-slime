import { PlayerStats } from "@/modules/player/models/player.model.js";
import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { EffectBattleEnum } from "@/rooms/battle/enums/effect.enum.js";
import { BattleEndReasonEnum } from "@/rooms/battle/enums/battle.enum.js";
import { EffectBattle, PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { ScaleStatKey, UpdateStatsBattle } from "@/rooms/battle/types/battle.types.js";

export class BattleCalcService {
    calculateDamage(p: UpdateStatsBattle): number {
        const scale = p.skill.scale;
        const stats = p.stats;
        return (Object.keys(scale) as ScaleStatKey[]).reduce((total, key) => {
            const statVal = stats[key];
            if (statVal === undefined) return total;
            return total + (scale[key] ?? 0) * Number(statVal);
        }, 0);
    }

    calculateDamageParry(skill: Skill, dmgEnemy: number): number {
        return dmgEnemy * (skill.scale.attackEnemy ?? 0);
    }

    calculateDamageReceive(stats: PlayerStats, dmg: number) {
        return Math.max(dmg - stats.defense, 0);
    }

    updateStats(
        p1: UpdateStatsBattle,
        p2: UpdateStatsBattle
    ): { p1Effects: EffectBattle[]; p2Effects: EffectBattle[] } {
        const skillP1 = p1.skill;
        const skillP2 = p2.skill;

        const dmgP1 = this.calculateDamage(p1);
        const dmgP2 = this.calculateDamage(p2);

        const statsP1 = p1.stats;
        const statsP2 = p2.stats;

        const p1Effects: EffectBattle[] = [];
        const p2Effects: EffectBattle[] = [];

        const applyDmg = (
            effects: EffectBattle[],
            stats: PlayerStats,
            typeEffect: EffectBattleEnum,
            dmg: number
        ) => {
            const received = this.calculateDamageReceive(stats, dmg);
            stats.hp -= received;
            effects.push({ typeEffect, value: received });
        };

        const key = this.genKeyMapCounter([skillP1.type, skillP2.type]);

        switch (key) {
            case this.genKeyMapCounter([SkillType.ATTACK, SkillType.ATTACK]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.ATTACK, dmgP2);
                applyDmg(p2Effects, statsP2, EffectBattleEnum.ATTACK, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.ATTACK, SkillType.DEFENSE]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.PARRY, this.calculateDamageParry(skillP2, dmgP1));
                break;
            case this.genKeyMapCounter([SkillType.ATTACK, SkillType.SPELL]):
                applyDmg(p2Effects, statsP2, EffectBattleEnum.ATTACK, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.DEFENSE, SkillType.ATTACK]):
                applyDmg(p2Effects, statsP2, EffectBattleEnum.PARRY, this.calculateDamageParry(skillP1, dmgP2));
                break;
            case this.genKeyMapCounter([SkillType.DEFENSE, SkillType.DEFENSE]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.DEFENSE, dmgP2);
                applyDmg(p2Effects, statsP2, EffectBattleEnum.DEFENSE, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.DEFENSE, SkillType.SPELL]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.SPELL, dmgP2);
                applyDmg(p2Effects, statsP2, EffectBattleEnum.DEFENSE, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.SPELL, SkillType.ATTACK]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.ATTACK, dmgP2);
                break;
            case this.genKeyMapCounter([SkillType.SPELL, SkillType.DEFENSE]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.DEFENSE, dmgP2);
                applyDmg(p2Effects, statsP2, EffectBattleEnum.SPELL, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.SPELL, SkillType.SPELL]):
                applyDmg(p1Effects, statsP1, EffectBattleEnum.SPELL, dmgP2);
                applyDmg(p2Effects, statsP2, EffectBattleEnum.SPELL, dmgP1);
                break;
        }

        return { p1Effects, p2Effects };
    }

    genKeyMapCounter(skillTypes: SkillType[]) {
        return skillTypes.join("_vs_");
    }

    isDead(hp: number): boolean {
        return hp <= 0;
    }

    getBattleResult(
        players: Map<string, PlayerTurnLog>,
        wave?: number,
        maxWave?: number
    ): { winner: string | null; endReason: BattleEndReasonEnum } | null {
        const [[p1Id, p1Log], [p2Id, p2Log]] = [...players.entries()];
        const p1Hp = p1Log.stats.hp;
        const p2Hp = p2Log.stats.hp;
        const p1Dead = this.isDead(p1Hp);
        const p2Dead = this.isDead(p2Hp);

        if (p1Dead || p2Dead) {
            return {
                winner: p1Dead && p2Dead ? null : p1Dead ? p2Id : p1Id,
                endReason: p1Dead && p2Dead ? BattleEndReasonEnum.DRAW : BattleEndReasonEnum.HP_DEPLETED,
            };
        }

        if (wave !== undefined && maxWave !== undefined && wave >= maxWave) {
            return {
                winner: p1Hp === p2Hp ? null : p1Hp > p2Hp ? p1Id : p2Id,
                endReason: BattleEndReasonEnum.MAX_WAVES,
            };
        }

        return null;
    }
}

export const battleCalcService = new BattleCalcService();
