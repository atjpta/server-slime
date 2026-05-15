import seedrandom from "seedrandom";
import { PlayerSkill, PlayerStats } from "@/modules/player/models/player.model.js";
import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import { IScaleValueSkill, Skill } from "@/modules/skills/models/skill.model.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { EffectBattleEnum } from "@/rooms/battle/enums/effect.enum.js";
import { IEffectBattle } from "@/modules/battle-log/models/battle-log.model.js";

type ScaleStatKey = keyof IScaleValueSkill & keyof PlayerStats;

interface IUpdateStatsBattle {
    skill: Skill;
    stats: PlayerStats;
}

export class BattleService {
    calculateDamage(p: IUpdateStatsBattle): number {
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
        p1: IUpdateStatsBattle,
        p2: IUpdateStatsBattle
    ): { p1Effects: IEffectBattle[]; p2Effects: IEffectBattle[] } {
        const skillP1 = p1.skill;
        const skillP2 = p2.skill;

        const dmgP1 = this.calculateDamage(p1);
        const dmgP2 = this.calculateDamage(p2);

        const statsP1 = p1.stats;
        const statsP2 = p2.stats;

        const p1Effects: IEffectBattle[] = [];
        const p2Effects: IEffectBattle[] = [];

        const applyDmg = (
            effects: IEffectBattle[],
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
                applyDmg(
                    p1Effects,
                    statsP1,
                    EffectBattleEnum.PARRY,
                    this.calculateDamageParry(skillP2, dmgP1)
                );
                break;
            case this.genKeyMapCounter([SkillType.ATTACK, SkillType.SPELL]):
                applyDmg(p2Effects, statsP2, EffectBattleEnum.ATTACK, dmgP1);
                break;
            case this.genKeyMapCounter([SkillType.DEFENSE, SkillType.ATTACK]):
                applyDmg(
                    p2Effects,
                    statsP2,
                    EffectBattleEnum.PARRY,
                    this.calculateDamageParry(skillP1, dmgP2)
                );
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

    getActionRandom(skills: Skill[], seed: string): number[] {
        const rng = seedrandom(seed);
        return Array.from({ length: BattleConstants.TURNS_PER_WAVE }, () =>
            Math.floor(rng() * skills.length)
        );
    }

    genSkillArray(playerSkills: PlayerSkill[]): Skill[] {
        return [...playerSkills].sort((a, b) => a.orderIndex - b.orderIndex).map((ps) => ps.skill);
    }
}

export const battleService = new BattleService();
